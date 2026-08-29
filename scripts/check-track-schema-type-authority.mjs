import ts from "typescript";

const EXPECTED_TRACK_DEF = Object.freeze({
  id: Object.freeze({ optional: false, type: "TrackId" }),
  nameHe: Object.freeze({ optional: false, type: "string" }),
  nameEn: Object.freeze({ optional: false, type: "string" }),
  city: Object.freeze({ optional: false, type: "CityId" }),
  cityHe: Object.freeze({ optional: false, type: "string" }),
  cityEn: Object.freeze({ optional: false, type: "string" }),
  lengthHint: Object.freeze({ optional: false, type: "string" }),
  description: Object.freeze({ optional: false, type: "string" }),
  descriptionEn: Object.freeze({ optional: false, type: "string" }),
  image: Object.freeze({ optional: false, type: "string" }),
  width: Object.freeze({ optional: false, type: "number" }),
  points: Object.freeze({ optional: false, type: "Vec2[]" }),
  elevation: Object.freeze({ optional: false, type: "(t:number)=>number" }),
  sky: Object.freeze({ optional: false, type: "SkyPreset" }),
  ground: Object.freeze({ optional: false, type: "number" }),
  sand: Object.freeze({ optional: false, type: "number" }),
  water: Object.freeze({ optional: true, type: "WaterBody" }),
  waters: Object.freeze({ optional: true, type: "WaterBody[]" }),
  clearZones: Object.freeze({ optional: true, type: "{x:number;z:number;w:number;d:number}[]" }),
  streets: Object.freeze({ optional: false, type: "StreetSeg[]" }),
  pois: Object.freeze({ optional: false, type: "Poi[]" }),
  checkpointCount: Object.freeze({ optional: false, type: "number" }),
  seed: Object.freeze({ optional: false, type: "number" }),
  theme: Object.freeze({
    optional: false,
    type: '"bauhaus"|"stone"|"carmel"|"desert"|"jaffa"|"port"|"highway"|"manhattan"|"park"|"snow"',
  }),
  open: Object.freeze({ optional: true, type: "boolean" }),
});

function propertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return null;
}

function normalizedType(node, sourceFile) {
  return node.getText(sourceFile).replace(/\s+/g, "");
}

export function validateTrackDefTypeAuthority(typeSource) {
  const errors = [];
  const sourceFile = ts.createSourceFile(
    "src/game/types.ts",
    String(typeSource ?? ""),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  for (const diagnostic of sourceFile.parseDiagnostics) {
    const line = diagnostic.start === undefined
      ? "unknown"
      : sourceFile.getLineAndCharacterOfPosition(diagnostic.start).line + 1;
    errors.push(
      `src/game/types.ts:${line} does not parse: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`,
    );
  }

  const aliases = sourceFile.statements.filter(
    (statement) => ts.isTypeAliasDeclaration(statement) && statement.name.text === "TrackDef",
  );
  if (aliases.length !== 1 || !ts.isTypeLiteralNode(aliases[0].type)) {
    errors.push("TrackDef type authority must remain exactly one type-literal alias");
    return errors;
  }

  const actual = new Map();
  for (const member of aliases[0].type.members) {
    if (!ts.isPropertySignature(member) || !member.name || !member.type) {
      errors.push("TrackDef may contain typed property signatures only");
      continue;
    }
    const name = propertyName(member.name);
    if (!name) {
      errors.push("TrackDef contains a computed property name");
      continue;
    }
    if (actual.has(name)) errors.push(`TrackDef contains duplicate property ${name}`);
    actual.set(name, {
      optional: Boolean(member.questionToken),
      type: normalizedType(member.type, sourceFile),
    });
  }

  const expectedNames = Object.keys(EXPECTED_TRACK_DEF);
  const actualNames = [...actual.keys()];
  if (
    actualNames.length !== expectedNames.length
    || actualNames.some((name, index) => name !== expectedNames[index])
  ) {
    errors.push("TrackDef property order and membership differ from the canonical RSH-013 authority");
  }

  for (const [name, expected] of Object.entries(EXPECTED_TRACK_DEF)) {
    const observed = actual.get(name);
    if (!observed) {
      errors.push(`TrackDef is missing canonical property ${name}`);
      continue;
    }
    if (observed.optional !== expected.optional) {
      errors.push(`TrackDef.${name} optionality differs from the canonical authority`);
    }
    if (observed.type !== expected.type) {
      errors.push(
        `TrackDef.${name} type ${observed.type} differs from canonical ${expected.type}`,
      );
    }
  }
  for (const name of actual.keys()) {
    if (!Object.hasOwn(EXPECTED_TRACK_DEF, name)) {
      errors.push(`TrackDef contains unreviewed property ${name}`);
    }
  }
  return errors;
}
