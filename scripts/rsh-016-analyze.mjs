#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const sourcePath = "src/game/world.ts";
const source = readFileSync(sourcePath, "utf8");
const manifest = JSON.parse(readFileSync("TRACK-MODULE-MANIFEST.json", "utf8"));
const trackIds = manifest.runtime_order;
const file = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

const sha256 = (text) => createHash("sha256").update(text).digest("hex");
const lineOf = (position) => file.getLineAndCharacterOfPosition(position).line + 1;
const nodeRange = (node) => ({
  start_line: lineOf(node.getStart(file)),
  end_line: lineOf(node.getEnd()),
  start_offset: node.getStart(file),
  end_offset: node.getEnd(),
  bytes: Buffer.byteLength(node.getText(file)),
  sha256: sha256(node.getText(file)),
});
const trackIdsIn = (text) => trackIds.filter((id) => new RegExp(`(?:["']${id}["'])`).test(text));
const findFunction = (name) => file.statements.find((statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === name);

const addLandmarks = findFunction("addLandmarks");
const createWorld = findFunction("createWorld");
const laneCountFor = findFunction("laneCountFor");
if (!addLandmarks?.body || !createWorld?.body || !laneCountFor?.body) {
  throw new Error("RSH-016 preflight could not resolve addLandmarks/createWorld/laneCountFor");
}

const topLevel = addLandmarks.body.statements.map((statement, index) => {
  const text = statement.getText(file);
  return {
    ordinal: index + 1,
    syntax_kind: ts.SyntaxKind[statement.kind],
    ...nodeRange(statement),
    track_ids: trackIdsIn(text),
    contains_def_id: /\bdef\.id\b/.test(text),
    contains_theme: /\bdef\.theme\b/.test(text),
    contains_track_helper: /\b(?:acr|afl|ard|asd|ask|bsn|bsv|bym|cae|dsea|eil|gol|hai|hdr|her|hol|hwy1|hwy2|hwy6|hwy40|hwy90|hzl|jer|ksb|ksm|lodp|mas|mod|naz|nah|net|nik|pth|raa|ram|rhv|rml|rsh|tib|tlv|tzf)\s*\(/.test(text),
    preview: text.replace(/\s+/g, " ").slice(0, 240),
  };
});

const ifStatements = [];
const walk = (node, topOrdinal = null, depth = 0) => {
  if (ts.isIfStatement(node)) {
    const condition = node.expression.getText(file);
    const thenText = node.thenStatement.getText(file);
    const elseText = node.elseStatement?.getText(file) ?? "";
    if (/\bdef\.(?:id|theme|city)\b/.test(condition) || trackIdsIn(condition).length) {
      ifStatements.push({
        ordinal: ifStatements.length + 1,
        top_level_ordinal: topOrdinal,
        depth,
        condition,
        condition_track_ids: trackIdsIn(condition),
        statement_track_ids: trackIdsIn(`${thenText}\n${elseText}`),
        ...nodeRange(node),
        then_range: nodeRange(node.thenStatement),
        else_range: node.elseStatement ? nodeRange(node.elseStatement) : null,
      });
    }
  }
  ts.forEachChild(node, (child) => walk(child, topOrdinal, depth + 1));
};
for (let index = 0; index < addLandmarks.body.statements.length; index += 1) {
  walk(addLandmarks.body.statements[index], index + 1, 0);
}

const references = Object.fromEntries(trackIds.map((id) => {
  const matches = [];
  const pattern = new RegExp(`["']${id}["']`, "g");
  for (const match of source.matchAll(pattern)) matches.push(lineOf(match.index ?? 0));
  return [id, matches];
}));

const report = {
  schema_version: "1.0.0",
  document_type: "rush-rsh-016-world-builder-preflight",
  unit: "RSH-016",
  repository: "talstilkol/rush-israel",
  canonical_branch: "main",
  implementation_base: {
    commit_sha: "973e68d6e1d3fa8ed628f4461cdfae3096d01ea3",
    tree_sha: "27e88997f6127a045b0c260850cabcf0c0d650fd",
  },
  source: {
    path: sourcePath,
    lines: (source.match(/\n/g) ?? []).length,
    bytes: Buffer.byteLength(source),
    sha256: sha256(source),
  },
  functions: {
    laneCountFor: nodeRange(laneCountFor),
    createWorld: nodeRange(createWorld),
    addLandmarks: nodeRange(addLandmarks),
  },
  add_landmarks: {
    top_level_statement_count: topLevel.length,
    top_level_statements: topLevel,
    track_condition_count: ifStatements.length,
    track_conditions: ifStatements,
  },
  track_references: references,
  invariants: {
    track_count: trackIds.length,
    runtime_definition_digest: manifest.semantic_integrity.ordered_runtime_definition_digest_sha256,
    aggregate_definition_digest: manifest.semantic_integrity.aggregate_runtime_definition_digest_sha256,
    rsh_017_started: false,
  },
};
writeFileSync("RSH-016-WORLD-BUILDER-PREFLIGHT.json", JSON.stringify(report, null, 2) + "\n");

const lines = [
  "# RSH-016 world-builder preflight",
  "",
  `- Base: \`${report.implementation_base.commit_sha}\``,
  `- world.ts: ${report.source.lines} lines / ${report.source.bytes} bytes`,
  `- addLandmarks: lines ${report.functions.addLandmarks.start_line}-${report.functions.addLandmarks.end_line}`,
  `- top-level statements: ${topLevel.length}`,
  `- track-aware conditionals: ${ifStatements.length}`,
  "",
  "| # | Lines | Kind | Track IDs | Preview |",
  "|---:|---:|---|---|---|",
  ...topLevel.map((entry) => `| ${entry.ordinal} | ${entry.start_line}-${entry.end_line} | ${entry.syntax_kind} | ${entry.track_ids.join(", ") || "—"} | ${entry.preview.replaceAll("|", "\\|")} |`),
  "",
];
writeFileSync("RSH-016-WORLD-BUILDER-PREFLIGHT.md", lines.join("\n"));
console.log(`rsh-016 preflight: ${topLevel.length} top-level statements, ${ifStatements.length} track conditionals`);
