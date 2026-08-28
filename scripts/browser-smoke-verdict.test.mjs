import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  baselineComparison,
  bodyTextPrefix,
  compareToBaseline,
  derivedPaths,
  exitCodeFor,
  normalizeBodyText,
  normalizedBodyTextHash,
  parseSmokeArgs,
} from "./browser-smoke-verdict.mjs";
import { fromRoot, projectRoot } from "./project-root.mjs";

function viewport(overrides = {}) {
  return {
    status: 200,
    title: "App",
    hasCanvas: false,
    horizontalOverflow: false,
    bodyTextLen: 500,
    bodyTextHash: "aaa",
    bodyTextPrefix: "hello world",
    consoleErrors: [],
    pageErrors: [],
    ...overrides,
  };
}

function verdict(desktop = {}, mobile = {}) {
  return { viewports: { desktop: viewport(desktop), mobile: viewport(mobile) } };
}

test("normalizes and hashes body text deterministically", () => {
  assert.equal(normalizeBodyText("  a \n\t b  "), "a b");
  assert.equal(normalizedBodyTextHash("a \n b"), normalizedBodyTextHash("  a b "));
  assert.notEqual(normalizedBodyTextHash("a b"), normalizedBodyTextHash("a c"));
  assert.equal(bodyTextPrefix("x".repeat(200)).length, 64);
});

test("identical verdicts do not diverge", () => {
  assert.deepEqual(compareToBaseline(verdict(), verdict()), {
    divergesFromBaseline: false,
    reasons: [],
  });
});

test("navigation, rendering and error regressions diverge", () => {
  const status = compareToBaseline(verdict({ status: 500 }), verdict());
  assert.match(status.reasons.join(";"), /HTTP status changed/);

  const title = compareToBaseline(verdict({ title: "Error" }), verdict());
  assert.match(title.reasons.join(";"), /title changed/);

  const canvas = compareToBaseline(verdict({ hasCanvas: false }), verdict({ hasCanvas: true }));
  assert.match(canvas.reasons.join(";"), /canvas disappeared/);

  const overflow = compareToBaseline(
    verdict({}, { horizontalOverflow: true }),
    verdict({}, { horizontalOverflow: false }),
  );
  assert.match(overflow.reasons.join(";"), /horizontal overflow appeared/);

  const errors = compareToBaseline(verdict({}, { consoleErrors: ["boom"] }), verdict());
  assert.match(errors.reasons.join(";"), /console\/page errors appeared/);
});

test("body collapse and meaningful replacement diverge", () => {
  const collapsed = compareToBaseline(
    verdict({ bodyTextLen: 10, bodyTextHash: "bbb" }),
    verdict(),
  );
  assert.match(collapsed.reasons.join(";"), /body text collapsed/);

  const replaced = compareToBaseline(
    verdict({ bodyTextLen: 510, bodyTextHash: "bbb", bodyTextPrefix: "500 Internal Error" }),
    verdict(),
  );
  assert.match(replaced.reasons.join(";"), /body text replaced/);
});

test("trivial body hash drift with the same prefix is tolerated", () => {
  const result = compareToBaseline(
    verdict({ bodyTextLen: 510, bodyTextHash: "bbb" }),
    verdict(),
  );
  assert.equal(result.divergesFromBaseline, false);
});

test("missing viewport and degenerate current verdict fail closed", () => {
  const missing = compareToBaseline(verdict(), { viewports: { desktop: viewport() } });
  assert.match(missing.reasons.join(";"), /mobile: no baseline data/);

  for (const current of [null, undefined, {}, { viewports: {} }]) {
    assert.deepEqual(compareToBaseline(current, verdict()), {
      divergesFromBaseline: true,
      reasons: ["current verdict has no viewport data"],
    });
  }
});

test("baseline JSON validation fails closed", () => {
  assert.deepEqual(baselineComparison(verdict(), "{"), {
    divergesFromBaseline: true,
    reasons: ["baseline unreadable: invalid JSON"],
  });
  for (const raw of ["null", "[]", "{}", '{"viewports": null}']) {
    assert.deepEqual(baselineComparison(verdict(), raw), {
      divergesFromBaseline: true,
      reasons: ["baseline unreadable: not a verdict object"],
    });
  }
  assert.equal(
    baselineComparison(verdict(), JSON.stringify(verdict())).divergesFromBaseline,
    false,
  );
});

test("parseSmokeArgs uses the actual repository root", () => {
  assert.deepEqual(parseSmokeArgs([], {}), {
    url: "http://127.0.0.1:8080/",
    outPng: fromRoot("screenshots", "app-builder-preview.png"),
    baseline: "",
  });
});

test("parseSmokeArgs handles baseline flags without shifting positionals", () => {
  const baseline = fromRoot("artifacts", "baseline.json");
  const output = fromRoot("screenshots", "current.png");
  assert.deepEqual(
    parseSmokeArgs(["http://127.0.0.1:8081/", "--baseline", baseline, output], {}),
    { url: "http://127.0.0.1:8081/", outPng: output, baseline },
  );
  assert.equal(parseSmokeArgs([`--baseline=${baseline}`], {}).baseline, baseline);
  assert.deepEqual(parseSmokeArgs(["--baseline"], {}), {
    error: "--baseline requires a path to a prior verdict JSON",
  });
  assert.deepEqual(parseSmokeArgs(["--nope"], {}), { error: "unknown flag: --nope" });
});

test("environment baseline is supported and explicit flag wins", () => {
  const envPath = fromRoot("artifacts", "env.json");
  const flagPath = fromRoot("artifacts", "flag.json");
  assert.equal(parseSmokeArgs([], { BROWSER_SMOKE_BASELINE: envPath }).baseline, envPath);
  assert.equal(
    parseSmokeArgs(["--baseline", flagPath], { BROWSER_SMOKE_BASELINE: envPath }).baseline,
    flagPath,
  );
});

test("derivedPaths is extension-safe and root-agnostic", () => {
  const input = fromRoot("screenshots", "shot.png");
  assert.deepEqual(derivedPaths(input), {
    mobilePng: fromRoot("screenshots", "shot-mobile.png"),
    verdictJson: fromRoot("screenshots", "shot.json"),
  });
  const upper = fromRoot("screenshots", "shot.PNG");
  assert.deepEqual(derivedPaths(upper), {
    mobilePng: fromRoot("screenshots", "shot-mobile.png"),
    verdictJson: fromRoot("screenshots", "shot.json"),
  });
});

test("exit codes distinguish navigation failure and page errors", () => {
  assert.equal(exitCodeFor(verdict().viewports), 0);
  assert.equal(exitCodeFor(verdict({}, { consoleErrors: ["boom"] }).viewports), 2);
  assert.equal(exitCodeFor(verdict({ status: 500 }).viewports), 1);
  assert.equal(exitCodeFor({}), 1);
});

test("browser smoke source contains no fixed workspace root", () => {
  const forbiddenRootName = ["work", "space"].join("");
  const forbiddenRoot = new RegExp(`/${forbiddenRootName}(?:/|\\b)`);
  for (const file of ["browser-smoke.mjs", "browser-smoke-verdict.mjs"]) {
    const source = readFileSync(join(projectRoot, "scripts", file), "utf8");
    assert.doesNotMatch(source, forbiddenRoot);
  }
});
