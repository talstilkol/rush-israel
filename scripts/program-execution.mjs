/** Current execution checks; historical grants never predict future acceptance. */
export const PROGRAM_TOTAL = 67;
export const unitId = (number) => `RSH-${String(number).padStart(3, "0")}`;
export const unitOrder = () => Array.from({ length: PROGRAM_TOTAL }, (_, i) => unitId(i + 1));

export function unactivatedFiles(files, activeNumber) {
  if (!Array.isArray(files) || !Number.isInteger(activeNumber)) return ["invalid execution scope"];
  return files.filter((path) => {
    if (typeof path !== "string" || path.startsWith("/") || path.split("/").includes("..")) return true;
    const unit = path.match(/(?:^|\/|\.)rsh[-_]?(\d{3})(?=[/_.-]|$)/i);
    if (unit && Number(unit[1]) > activeNumber) return true;
    return (activeNumber < 37 && path.startsWith("src/game/perf-instrument/"))
      || (activeNumber < 38 && path.startsWith("src/game/quality-profiles/"));
  });
}

export function validateProgramExecution({ current, queue, files = [], plan, originalUnits, trackIds } = {}) {
  const errors = [];
  if (!current?.program_status || !queue?.counts || !queue?.queue_head) return ["missing execution authority"];
  const order = unitOrder();
  const counts = queue.counts;
  for (const key of ["total", "accepted", "in_review", "eligible", "deferred", "remaining"]) {
    if (!Number.isInteger(counts[key]) || counts[key] < 0 || counts[key] > PROGRAM_TOTAL) errors.push(`invalid count: ${key}`);
  }
  if (counts.total !== PROGRAM_TOTAL) errors.push("program total changed");
  if (JSON.stringify(queue.unit_order) !== JSON.stringify(order)) errors.push("unit order changed");
  if (counts.accepted + counts.in_review + counts.eligible + counts.deferred !== PROGRAM_TOTAL) errors.push("counts do not partition program");
  if (counts.remaining !== PROGRAM_TOTAL - counts.accepted) errors.push("remaining count changed");
  const acceptedIds = Object.keys(queue.accepted ?? {}).sort();
  if (JSON.stringify(acceptedIds) !== JSON.stringify(order.slice(0, counts.accepted))) errors.push("accepted set is not contiguous or count is premature");
  if (JSON.stringify(Object.keys(current.accepted_units ?? {}).sort()) !== JSON.stringify(acceptedIds)) errors.push("accepted authorities disagree");
  const fields = { program_units_total: "total", accepted_units: "accepted", units_in_review: "in_review", eligible_units: "eligible", deferred_units: "deferred", remaining_units: "remaining" };
  for (const [field, key] of Object.entries(fields)) if (current.program_status[field] !== counts[key]) errors.push(`state/queue disagreement: ${field}`);
  if (current.verified_main?.head_sha !== queue.verified_base_sha) errors.push("verified main authorities disagree");
  if (current.state_semantics?.effective_event !== queue.state_effective_on) errors.push("state semantics disagree");
  if (counts.in_review > 1 || counts.eligible > 1 || counts.in_review + counts.eligible > 1) errors.push("multiple active units");
  const active = queue.queue_head.id;
  if (active !== (order[counts.accepted] ?? null)) errors.push("queue skips predecessor acceptance");
  if (active && (Object.hasOwn(queue.accepted ?? {}, active) || Object.hasOwn(current.accepted_units ?? {}, active))) errors.push("active unit counted as accepted");
  const authority = current.execution_authorization;
  if (!authority || JSON.stringify(authority) !== JSON.stringify(queue.policy?.standing_authorization)) errors.push("standing authorization authorities disagree");
  if (authority?.max_active_program_units !== 1 || authority?.activation_is_not_acceptance !== true || authority?.future_activation_requires_predecessor_acceptance !== true) errors.push("activation safeguards weakened");
  if (authority?.active_unit !== active) errors.push("active unit differs from authorization");
  if (!Array.isArray(authority?.authorized_units) || order.slice(counts.accepted).some((id) => !authority.authorized_units.includes(id))) errors.push("remaining execution lacks owner authorization");
  for (const restriction of ["public_distribution", "force_push", "history_rewrite", "invented_test_or_license_evidence", "acceptance_without_validation"]) {
    if (!authority?.not_authorized?.includes(restriction)) errors.push(`standing grant lost restriction: ${restriction}`);
  }
  if (queue.policy?.force_push !== false || queue.policy?.history_rewrite !== false || queue.policy?.automatic_merge_without_validation !== false || queue.policy?.direct_main_writes !== false) errors.push("repository safety policy weakened");
  if (counts.in_review === 1 && (current.active_change?.unit !== active || current.active_change?.state !== "in_review" || !Object.hasOwn(queue.in_review ?? {}, active))) errors.push("in-review authority missing");
  if (current.product_snapshot?.unverified_asset_files > 0 && current.product_snapshot?.legal_clearance_complete === true) errors.push("unverified assets claimed cleared");
  if (current.program_status.release_gates_green > 0) {
    const evidence = current.release_gate_evidence;
    const proven = Array.isArray(evidence) ? evidence.filter((gate) => gate?.state === "green" && typeof gate.id === "string" && /^[a-f0-9]{40}$/.test(gate.verified_head ?? "") && Array.isArray(gate.sources) && gate.sources.length > 0 && gate.sources.every((source) => typeof source === "string" && source.length > 0)) : [];
    if (proven.length !== current.program_status.release_gates_green || new Set(proven.map(({ id }) => id)).size !== proven.length) errors.push("release gates lack evidence");
  }
  for (const path of unactivatedFiles(files, counts.accepted + (active ? 1 : 0))) errors.push(`unactivated unit file: ${path}`);
  if (plan) {
    if (JSON.stringify(plan.units?.map(({ id, title }) => ({ id, title }))) !== JSON.stringify(originalUnits)) errors.push("canonical unit identities were renumbered or renamed");
    if (JSON.stringify(plan.v1_track_ids) !== JSON.stringify(trackIds)) errors.push("V1 track mapping changed");
    for (const item of plan.audit_items ?? []) if (!Array.isArray(item.units) || item.units.some((id) => !order.includes(id))) errors.push(`audit item has unknown unit: ${item.id}`);
  }
  return errors;
}
