import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";
import { validateTrackConsumerSourcePin } from "./check-track-consumer-source-pin.mjs";
import { validateTrackSchema } from "./check-track-schema.mjs";
import { readCanonicalTrackSource } from "./load-track-modules.mjs";

const CONSUMER_PATHS = [
  "src/components/game-app.tsx",
  "src/game/daily.ts",
  "src/game/engine.ts",
  "src/game/world.ts",
];

function readConsumerSources() {
  return Object.fromEntries(
    CONSUMER_PATHS.map((filePath) => [
      filePath,
      readFileSync(fromRoot(...filePath.split("/")), "utf8"),
    ]),
  );
}

function completeInputs(consumerSources = readConsumerSources()) {
  return {
    schema: JSON.parse(readFileSync(fromRoot("TRACK-SCHEMA.json"), "utf8")),
    classification: JSON.parse(
      readFileSync(fromRoot("TRACK-CATALOGUE-CLASSIFICATION.json"), "utf8"),
    ),
    typeSource: readFileSync(fromRoot("src", "game", "types.ts"), "utf8"),
    trackSource: readCanonicalTrackSource(),
    trackSchemaSource: readFileSync(fromRoot("src", "game", "track-schema.ts"), "utf8"),
    supportSources: {
      "src/game/math.ts": readFileSync(fromRoot("src", "game", "math.ts"), "utf8"),
    },
    consumerSources,
  };
}

test("the accepted runtime track consumer set and four source identities are pinned", () => {
  const result = validateTrackConsumerSourcePin({
    consumerSources: readConsumerSources(),
  });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.consumers, CONSUMER_PATHS);
  assert.equal(result.identities.length, 4);
});

test("a direct TRACKS mutation in a current consumer fails closed", () => {
  const sources = readConsumerSources();
  sources["src/game/daily.ts"] += "\nTRACKS.reverse();\n";
  assert.match(
    validateTrackConsumerSourcePin({ consumerSources: sources }).errors.join("\n"),
    /src\/game\/daily\.ts Git blob identity/,
  );
});

test("a getTrack result mutation in a current consumer fails closed", () => {
  const sources = readConsumerSources();
  sources["src/game/engine.ts"] += '\ngetTrack("ayalon").width = 1;\n';
  assert.match(
    validateTrackConsumerSourcePin({ consumerSources: sources }).errors.join("\n"),
    /src\/game\/engine\.ts Git blob identity/,
  );
});

test("a new static runtime consumer fails closed", () => {
  const sources = readConsumerSources();
  sources["src/game/unreviewed-consumer.ts"] =
    'import { TRACKS } from "./tracks";\nTRACKS.reverse();\n';
  assert.match(
    validateTrackConsumerSourcePin({ consumerSources: sources }).errors.join("\n"),
    /runtime track consumer set differs/,
  );
});

test("a new dynamic runtime consumer fails closed", () => {
  const sources = readConsumerSources();
  sources["src/game/unreviewed-dynamic.ts"] =
    'const catalogue = await import("./tracks");\ncatalogue.TRACKS.reverse();\n';
  assert.match(
    validateTrackConsumerSourcePin({ consumerSources: sources }).errors.join("\n"),
    /runtime track consumer set differs/,
  );
});

test("aliased runtime consumers normalize every supported source extension", () => {
  const moduleNames = [
    "@/game/tracks.js",
    "@/game/tracks.jsx",
    "@/game/tracks.mjs",
    "@/game/tracks.cjs",
    "@/game/tracks.ts",
    "@/game/tracks.tsx",
    "@/game/tracks.mts",
    "@/game/tracks.cts",
    "@/game/tracks/index.js",
  ];
  for (const [index, moduleName] of moduleNames.entries()) {
    const sources = readConsumerSources();
    sources[`src/game/unreviewed-alias-${index}.ts`] =
      `import { TRACKS } from "${moduleName}";\nTRACKS.reverse();\n`;
    assert.match(
      validateTrackConsumerSourcePin({ consumerSources: sources }).errors.join("\n"),
      /runtime track consumer set differs/,
      moduleName,
    );
  }
});

test("type-only imports do not expand the runtime consumer authority", () => {
  const sources = readConsumerSources();
  sources["src/game/type-only.ts"] =
    'import type { TrackDef } from "./tracks";\nexport type Copy = TrackDef;\n';
  assert.deepEqual(
    validateTrackConsumerSourcePin({ consumerSources: sources }).errors,
    [],
  );
});

test("the complete schema gate incorporates runtime consumer protection", () => {
  const sources = readConsumerSources();
  sources["src/components/game-app.tsx"] += "\nTRACKS.sort(() => 0);\n";
  const result = validateTrackSchema(completeInputs(sources));
  assert.equal(Array.isArray(result), false);
  assert.match(
    result.errors.join("\n"),
    /src\/components\/game-app\.tsx Git blob identity/,
  );
});
