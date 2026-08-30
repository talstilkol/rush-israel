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

test("RSH-016 manifest-bound builders remain internal to the accepted world consumer", () => {
  const result = validateTrackConsumerSourcePin();
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.consumers, CONSUMER_PATHS);
  assert.equal(result.identities.length, 4);
});

test("RSH-016 world extraction is accepted only through byte-exact legacy reconstruction", () => {
  const result = validateTrackConsumerSourcePin({ consumerSources: readConsumerSources() });
  const world = result.identities.find((entry) => entry.path === "src/game/world.ts");
  assert.equal(world.controlled_reconstruction, true);
  assert.equal(world.git_blob_sha1, "07b7e0b559e66f89641357db5aa2be8bcd8c3135");
  assert.notEqual(world.current_git_blob_sha1, world.git_blob_sha1);
});

test("world changes outside the bounded RSH-015 and RSH-016 extractions fail closed", () => {
  const sources = readConsumerSources();
  sources["src/game/world.ts"] = sources["src/game/world.ts"].replace(
    "var _dummy = new THREE.Object3D();",
    "var _dummy = new THREE.Group();",
  );
  assert.match(
    validateTrackConsumerSourcePin({ consumerSources: sources }).errors.join("\n"),
    /src\/game\/world\.ts Git blob identity|controlled RSH-016 reconstruction failed/,
  );
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

test("an unregistered world-builder path cannot hide a new runtime consumer", () => {
  const sources = readConsumerSources();
  sources["src/game/world-builders/tracks/unreviewed.ts"] =
    'import { TRACKS } from "../../tracks";\nTRACKS.reverse();\n';
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

test("the canonical facade may import the modular index without becoming an external consumer", () => {
  const sources = readConsumerSources();
  sources["src/game/tracks.ts"] =
    'import { TRACKS } from "./tracks/index";\nexport { TRACKS };\n';
  const result = validateTrackConsumerSourcePin({ consumerSources: sources });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.consumers, CONSUMER_PATHS);
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
