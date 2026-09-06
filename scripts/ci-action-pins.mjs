/** Verified upstream ref identities, not a claim of an exhaustive third-party code audit. */
export const CI_ACTION_PINS = Object.freeze({
  'actions/checkout': '11d5960a326750d5838078e36cf38b85af677262',
  'actions/setup-node': '49933ea5288caeca8642d1e84afbd3f7d6820020',
  'actions/upload-artifact': 'ea165f8d65b6e75b540449e92b4886f43607fa02',
});
export function inspectActionUses(text, from) {
  const actions = [], unresolved = [];
  for (const match of text.matchAll(/^\s*(?:-\s*)?uses:\s*([^\r\n]+)$/gm)) {
    const value = match[1].replace(/\s+#.*$/, '').trim().replace(/^(['"])(.*)\1$/, '$2');
    const split = /^([\w.-]+\/[\w./-]+)@([0-9a-f]{40})$/.exec(value);
    if (split && CI_ACTION_PINS[split[1]] === split[2])
      actions.push({ from, action: split[1], commit: split[2], qualification: 'verified_upstream_ref_identity' });
    else unresolved.push({ from, resource: value, kind: 'action_reference', qualification: 'reviewed_immutable_commit_required' });
  }
  return { actions, unresolved };
}
