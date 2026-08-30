#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

BASE_SHA = "973e68d6e1d3fa8ed628f4461cdfae3096d01ea3"
BASE_TREE = "27e88997f6127a045b0c260850cabcf0c0d650fd"
BRANCH = "agent/rsh-016-track-builders"
NOW = datetime.now(ZoneInfo("Asia/Jerusalem")).replace(microsecond=0).isoformat()
MERGED_AT_RSH015 = "2026-08-30T02:00:09+03:00"

RSH015 = {
    "state": "accepted",
    "branch": "agent/rsh-015-world-core",
    "pull_request": 18,
    "merge_sha": BASE_SHA,
    "tree_sha": BASE_TREE,
    "validated_head_sha": "d061eb6adcf84ddbc9361f4f5fe3b0b5c83b05e4",
    "workflow_run": 33279513653,
    "workflow_job": 99172185122,
    "artifact_id": 9722594860,
    "artifact_digest": "sha256:43dc4aec7ce824c525356ad1a4e02f3b0fc42723ad6a2510e302bf66b88b2b8a",
    "post_merge_workflow_run": 33279921857,
    "post_merge_workflow_job": 99173247441,
    "post_merge_artifact_id": 9722713132,
    "post_merge_artifact_digest": "sha256:9f3c8c95a0fcadaaf9c0f00a9c73c9716d79e84d34d1f8c34021c327c3d8649b",
    "codex_review_exact_head": True,
    "resolved_review_threads": 1,
    "unresolved_review_threads": 0,
    "unit_tests_passed": 344,
    "unit_tests_failed": 0,
    "manifest": "WORLD-CORE-MANIFEST.json",
    "contract": "RSH-015-WORLD-CORE-CONTRACT.md",
    "inventory": "RSH-015-WORLD-INVENTORY.json",
    "world_path": "src/game/world.ts",
    "world_lines_before": 9034,
    "world_bytes_before": 353285,
    "world_lines_after": 9006,
    "world_bytes_after": 352625,
    "core_path": "src/game/world-core.ts",
    "core_lines": 116,
    "core_bytes": 2604,
    "legacy_world_sha256": "db0fd7cada42d3f3479fa6fffca61d3668a6ce3e7977152935480c7dce124056",
    "legacy_world_git_blob_sha1": "07b7e0b559e66f89641357db5aa2be8bcd8c3135",
    "runtime_behavior_changes": 0,
    "track_data_changes": 0,
    "physics_changes": 0,
    "asset_changes": 0,
    "dependency_changes": 0,
    "RSH-016_created_at_acceptance": False,
    "RSH-016_authorized_at_acceptance": False,
}

def read_json(path: str):
    return json.loads(Path(path).read_text(encoding="utf-8"))

def write_json(path: str, value) -> None:
    Path(path).write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

def must_replace(text: str, old: str, new: str, *, count: int = 1) -> str:
    actual = text.count(old)
    if actual != count:
        raise RuntimeError(f"expected {count} occurrence(s) of {old!r}, found {actual}")
    return text.replace(old, new, count)

world_builder = read_json("WORLD-BUILDER-MANIFEST.json")
modules = world_builder["extraction"]["modules"]
track_builder_lines = sum(module["lines"] for module in modules)
track_builder_bytes = sum(module["bytes"] for module in modules)
support_lines = sum(
    world_builder["extraction"][name]["lines"]
    for name in ("types", "shared", "registry")
)
support_bytes = sum(
    world_builder["extraction"][name]["bytes"]
    for name in ("types", "shared", "registry")
)
builder_lines_total = track_builder_lines + support_lines
builder_bytes_total = track_builder_bytes + support_bytes

RSH016 = {
    "state": "accepted_on_merge",
    "branch": BRANCH,
    "pull_request_resolution": "the pull request created from agent/rsh-016-track-builders",
    "validated_head_resolution": "exact pull-request head accepted by required-ci / validate and Codex review",
    "merge_sha_resolution": "live main HEAD created by merging the RSH-016 pull request",
    "post_merge_ci_resolution": "required-ci / validate on the exact RSH-016 merge SHA",
    "manifest": "WORLD-BUILDER-MANIFEST.json",
    "contract": "RSH-016-WORLD-BUILDER-CONTRACT.md",
    "preflight_json": "RSH-016-WORLD-BUILDER-PREFLIGHT.json",
    "preflight_markdown": "RSH-016-WORLD-BUILDER-PREFLIGHT.md",
    "create_world_preflight": "RSH-016-CREATE-WORLD-PREFLIGHT.md",
    "world_path": "src/game/world.ts",
    "world_lines_before": 9006,
    "world_bytes_before": 352625,
    "world_lines_after": world_builder["extraction"]["world"]["lines"],
    "world_bytes_after": world_builder["extraction"]["world"]["bytes"],
    "world_sha256": world_builder["extraction"]["world"]["sha256"],
    "builder_module_count": len(modules),
    "track_builder_lines": track_builder_lines,
    "track_builder_bytes": track_builder_bytes,
    "builder_support_lines": support_lines,
    "builder_support_bytes": support_bytes,
    "builder_lines_total": builder_lines_total,
    "builder_bytes_total": builder_bytes_total,
    "legacy_world_sha256": world_builder["reconstruction"]["expected_sha256"],
    "legacy_world_git_blob_sha1": world_builder["reconstruction"]["expected_git_blob_sha1"],
    "runtime_behavior_changes": 0,
    "track_data_changes": 0,
    "track_order_changes": 0,
    "physics_changes": 0,
    "asset_changes": 0,
    "dependency_changes": 0,
    "renderer_changes": 0,
    "save_record_changes": 0,
    "qa_interface_changes": 0,
    "RSH-017_created": False,
    "RSH-017_authorized": False,
}

current = read_json("CURRENT-STATE.json")
previous_authorization = current.get("single_unit_authorization")
current["schema_version"] = "5.0.0"
current["generated_at"] = NOW
current["state_semantics"] = {
    "effective_event": "merge_of_RSH_016_pull_request",
    "implementation_base_sha": BASE_SHA,
    "self_reference_boundary": (
        "The RSH-016 candidate cannot contain its own future merge SHA. "
        "Exact PR, merge and post-merge CI evidence are resolved from live GitHub "
        "and recorded on the pull request after acceptance."
    ),
}
current["verified_main"] = {
    "head_sha": BASE_SHA,
    "tree_sha": BASE_TREE,
    "commit_authored_at": MERGED_AT_RSH015,
    "commit_message": "Merge PR #18: RSH-015 — Extract the world core from world.ts",
    "commit_signature_verified": True,
    "role": "RSH-016 exact implementation base",
}
current["program_status"].update({
    "program_units_total": 67,
    "accepted_units": 16,
    "units_in_review": 0,
    "eligible_units": 0,
    "deferred_units": 51,
    "remaining_units": 51,
    "queue_head": "RSH-017",
    "queue_head_state": "deferred_not_authorized",
    "queue_head_branch": None,
    "queue_head_pull_request": None,
    "automatic_execution": False,
    "release_gates_green": 0,
    "release_gates_total": 13,
})
current["accepted_units"]["RSH-015"] = RSH015
current["accepted_units"]["RSH-016"] = RSH016
current["active_change"] = None
current["last_transition"] = {
    "unit": "RSH-016",
    "state": "accepted_on_merge",
    "branch": BRANCH,
    "pull_request_resolution": "the pull request created from this branch",
    "merge_sha_resolution": "live main HEAD created by merge",
    "post_merge_ci_resolution": "required-ci / validate on the exact merge SHA",
}
batch = current["batch_authorization"]
batch.pop("RSH-016_authorized", None)
batch.update({
    "next_instruction_required": True,
    "RSH-015_was_separately_authorized": True,
    "RSH-015_authorization_consumed": True,
    "RSH-016_was_separately_authorized": True,
    "RSH-016_authorization_consumed": True,
    "RSH-017_authorized": False,
})
current["prior_single_unit_authorization"] = previous_authorization
current["single_unit_authorization"] = {
    "instruction": "next",
    "authorized_units": ["RSH-016"],
    "completed_units": 1,
    "total_units": 1,
    "state": "consumed_on_RSH-016_merge",
    "separate_branch_and_pr": True,
    "merge_after_validation": True,
    "RSH-017_authorized": False,
    "next_instruction_required": True,
}
current["constraints"] = [
    "Do not claim the repository is private until GitHub metadata confirms it.",
    "Do not claim branch protection is applied until GitHub metadata confirms it.",
    "Do not claim legal clearance while 66 asset files remain unverified.",
    "The plain next instruction authorized exactly RSH-016 and is consumed on its validated merge.",
    "Do not pre-create or execute RSH-017.",
    "Public distribution remains unauthorized.",
    "Release gates remain 0/13.",
]
current["validation"].update({
    "game_source_changes": 60,
    "asset_binary_changes": 0,
    "dependency_version_changes": 0,
    "package_lock_changes": 0,
    "RSH-016_precreated": False,
    "RSH-016_authorized": True,
    "RSH-016_authorization_consumed_on_merge": True,
    "RSH-016_world_lines_before": 9006,
    "RSH-016_world_lines_after": world_builder["extraction"]["world"]["lines"],
    "RSH-016_world_bytes_after": world_builder["extraction"]["world"]["bytes"],
    "RSH-016_builder_modules": len(modules),
    "RSH-016_builder_lines_total": builder_lines_total,
    "RSH-016_builder_bytes_total": builder_bytes_total,
    "RSH-016_runtime_behavior_changes": 0,
    "RSH-017_precreated": False,
    "RSH-017_authorized": False,
})
current["rsh_015_world_core"].update({
    "state": "accepted",
    "pull_request": 18,
    "merge_sha": BASE_SHA,
    "tree_sha": BASE_TREE,
    "validated_head_sha": RSH015["validated_head_sha"],
    "workflow_run": RSH015["workflow_run"],
    "workflow_job": RSH015["workflow_job"],
    "post_merge_workflow_run": RSH015["post_merge_workflow_run"],
    "post_merge_workflow_job": RSH015["post_merge_workflow_job"],
})
current["rsh_016_world_builders"] = {
    "state": "accepted_on_merge",
    "machine_authority": "WORLD-BUILDER-MANIFEST.json",
    "human_contract": "RSH-016-WORLD-BUILDER-CONTRACT.md",
    "preflight_json": "RSH-016-WORLD-BUILDER-PREFLIGHT.json",
    "preflight_markdown": "RSH-016-WORLD-BUILDER-PREFLIGHT.md",
    "validator": "scripts/check-world-builders.mjs",
    "test": "scripts/check-world-builders.test.mjs",
    "facade": "src/game/world.ts",
    "registry": "src/game/world-builders/index.ts",
    "shared": "src/game/world-builders/shared.ts",
    "types": "src/game/world-builders/types.ts",
    "track_directory": "src/game/world-builders/tracks",
    "module_count": len(modules),
    "world_lines_before": 9006,
    "world_lines_after": world_builder["extraction"]["world"]["lines"],
    "world_bytes_before": 352625,
    "world_bytes_after": world_builder["extraction"]["world"]["bytes"],
    "track_builder_lines": track_builder_lines,
    "track_builder_bytes": track_builder_bytes,
    "builder_lines_total": builder_lines_total,
    "builder_bytes_total": builder_bytes_total,
    "legacy_reconstruction_sha256": world_builder["reconstruction"]["expected_sha256"],
    "runtime_behavior_changes": 0,
    "track_data_changes": 0,
    "track_order_changes": 0,
    "physics_changes": 0,
    "asset_changes": 0,
    "dependency_changes": 0,
    "RSH-017_created": False,
    "RSH-017_authorized": False,
}
write_json("CURRENT-STATE.json", current)

queue = read_json("QUEUE.json")
previous_queue_authorization = queue["policy"].get("latest_single_unit_authorization")
queue["schema_version"] = "5.0.0"
queue["generated_at"] = NOW
queue["verified_base_sha"] = BASE_SHA
queue["state_effective_on"] = "merge_of_RSH_016_pull_request"
queue["policy"]["previous_single_unit_authorization"] = previous_queue_authorization
queue["policy"]["latest_single_unit_authorization"] = {
    "instruction": "next",
    "authorized_units": ["RSH-016"],
    "completed": 1,
    "total": 1,
    "state": "consumed_on_RSH-016_merge",
    "RSH-017_authorized": False,
}
queue["counts"] = {
    "total": 67,
    "accepted": 16,
    "in_review": 0,
    "eligible": 0,
    "deferred": 51,
    "remaining": 51,
}
queue["queue_head"] = {
    "id": "RSH-017",
    "title": "Split engine.ts into loop, rendering, physics and QA adapters",
    "state": "deferred_not_authorized",
    "branch": None,
    "pull_request": None,
    "acceptance_condition": "A new explicit owner instruction is required before RSH-017 may start.",
}
queue["next_after_acceptance"] = {
    "id": "RSH-017",
    "title": "Split engine.ts into loop, rendering, physics and QA adapters",
    "state": "deferred_not_authorized",
}
queue["accepted"]["RSH-015"] = RSH015
queue["accepted"]["RSH-016"] = RSH016
queue["state_rules"] = {
    "RSH-001–RSH-016": "accepted",
    "RSH-017–RSH-067": "deferred_not_authorized",
    "accepted": {"from": "RSH-001", "through": "RSH-016"},
    "eligible": [],
    "deferred": {"from": "RSH-017", "through": "RSH-067"},
}
queue["next_instruction_contract"] = {
    "current_action": "No unit is authorized; RSH-017 remains deferred until a new explicit owner instruction.",
    "after_RSH_016": "The one-unit next authorization is consumed; RSH-017 requires a new explicit owner instruction.",
    "authorization_remaining": 0,
    "RSH-016_completed": True,
    "RSH-016_authorization_consumed": True,
    "RSH-017_authorized": False,
    "authorized_sequence": ["RSH-016"],
    "completed_sequence": ["RSH-016"],
    "authorization_closed": True,
    "continuation": "A new explicit owner instruction is required.",
}
queue["self_reference_boundary"] = {
    "RSH-016_merge_sha": "resolve from live main after the RSH-016 pull request merges",
    "RSH-016_validated_head": "resolve from the exact merged RSH-016 pull-request head",
    "RSH-016_post_merge_ci": "resolve from required-ci on the exact merge SHA",
    "reconcile_in": "RSH-017 preflight",
}
write_json("QUEUE.json", queue)

baseline = read_json("BASELINE-REGISTER.json")
baseline["schema_version"] = "4.0.0"
baseline["generated_at"] = NOW
exact_b015 = {
    "id": "B015-rsh-015-accepted",
    "kind": "accepted-unit",
    "unit": "RSH-015",
    "pull_request": 18,
    "commit_sha": BASE_SHA,
    "tree_sha": BASE_TREE,
    "validated_head_sha": RSH015["validated_head_sha"],
    "workflow_run": RSH015["workflow_run"],
    "workflow_job": RSH015["workflow_job"],
    "artifact_id": RSH015["artifact_id"],
    "artifact_digest": RSH015["artifact_digest"],
    "post_merge_workflow_run": RSH015["post_merge_workflow_run"],
    "post_merge_workflow_job": RSH015["post_merge_workflow_job"],
    "post_merge_artifact_id": RSH015["post_merge_artifact_id"],
    "post_merge_artifact_digest": RSH015["post_merge_artifact_digest"],
    "world_core_manifest": "WORLD-CORE-MANIFEST.json",
    "world_lines_before": 9034,
    "world_lines_after": 9006,
    "world_core_lines": 116,
    "legacy_world_sha256": RSH015["legacy_world_sha256"],
    "runtime_behavior_changes": 0,
    "recorded_at": MERGED_AT_RSH015,
    "description": "Typed track-agnostic World contract and lifecycle assembly accepted with byte-exact legacy reconstruction and zero runtime drift.",
}
candidate_b016 = {
    "id": "B016-rsh-016-accepted",
    "kind": "accepted-unit-on-merge",
    "unit": "RSH-016",
    "branch": BRANCH,
    "pull_request_resolution": "live GitHub pull request for this branch",
    "validated_head_resolution": "exact pull-request head accepted by required-ci / validate and Codex review",
    "commit_sha_resolution": "live main HEAD created by merging the RSH-016 pull request",
    "tree_sha_resolution": "tree of the live RSH-016 merge commit",
    "post_merge_ci_resolution": "required-ci / validate on the exact merge SHA",
    "exact_evidence_record": "pull-request acceptance comment after merge",
    "world_builder_manifest": "WORLD-BUILDER-MANIFEST.json",
    "world_lines_before": 9006,
    "world_lines_after": world_builder["extraction"]["world"]["lines"],
    "world_bytes_before": 352625,
    "world_bytes_after": world_builder["extraction"]["world"]["bytes"],
    "builder_modules": len(modules),
    "builder_lines_total": builder_lines_total,
    "builder_bytes_total": builder_bytes_total,
    "legacy_world_sha256": world_builder["reconstruction"]["expected_sha256"],
    "runtime_behavior_changes": 0,
    "recorded_at": NOW,
    "description": "Exactly 56 isolated per-track world builders replace the monolithic landmark dispatcher while reconstructing the accepted RSH-015 world source byte-for-byte.",
}
baseline["baselines"] = [
    exact_b015 if item.get("id") == "B015-rsh-015-accepted" else item
    for item in baseline["baselines"]
    if item.get("id") != "B016-rsh-016-accepted"
]
baseline["baselines"].append(candidate_b016)
baseline["working_state"] = {
    "unit": "RSH-016",
    "state": "accepted_on_merge",
    "base_commit_sha": BASE_SHA,
    "branch": BRANCH,
    "pull_request_resolution": "live GitHub pull request for this branch",
    "head_sha_resolution": "exact PR head accepted by required-ci / validate and Codex review",
    "merge_sha_resolution": "live main HEAD created by merging the RSH-016 pull request",
    "post_merge_ci_resolution": "required-ci on the exact merge SHA",
    "world_builder_manifest": "WORLD-BUILDER-MANIFEST.json",
    "world_lines_before": 9006,
    "world_lines_after": world_builder["extraction"]["world"]["lines"],
    "builder_modules": len(modules),
    "builder_lines_total": builder_lines_total,
    "runtime_behavior_changes": 0,
    "is_release": False,
    "tag_created": False,
    "release_created": False,
    "live_branch_protection": False,
    "settings_application_state": "owner_action_required",
}
baseline["post_merge_queue"] = {
    "queue_head": "RSH-017",
    "state": "deferred_not_authorized",
    "branch": None,
    "pull_request": None,
    "requires_new_next": True,
    "RSH-017_authorized": False,
}
write_json("BASELINE-REGISTER.json", baseline)

next_contract = f"""# RUSH Israel — NEXT Contract

**Version:** 5.0.0
**Repository:** `talstilkol/rush-israel`
**Canonical branch:** `main`
**RSH-016 implementation base:** `{BASE_SHA}`
**State effective on:** merge of the RSH-016 pull request
**Next unit:** `RSH-017` — deferred and not authorised

## Authority

GitHub is the sole source of truth. The plain `next` instruction authorised exactly RSH-016 under the canonical one-unit queue rule. That authority is consumed on the validated RSH-016 merge and does not extend to RSH-017.

## RSH-016 acceptance boundary

- exactly **56** builder modules exist under `src/game/world-builders/tracks`, one per accepted runtime Track ID;
- `src/game/world-builders/index.ts` is the sole registry and dispatch authority;
- `src/game/world-builders/shared.ts` is the sole shared-context authority;
- `src/game/world.ts` remains the concrete world composition root and public compatibility facade;
- `world.ts` falls from **9,006 lines / 352,625 bytes** to **{world_builder["extraction"]["world"]["lines"]:,} lines / {world_builder["extraction"]["world"]["bytes"]:,} bytes**;
- the extracted builder source totals **{builder_lines_total:,} lines / {builder_bytes_total:,} bytes**, including **{track_builder_lines:,} lines / {track_builder_bytes:,} bytes** in the 56 per-track modules;
- the accepted RSH-015 `world.ts` reconstructs byte-for-byte with SHA-256 `{world_builder["reconstruction"]["expected_sha256"]}`;
- track data/order, physics, assets, dependencies, rendering, save/record and QA behaviour change by **0**;
- exact-head required CI and Codex review must pass before merge;
- no RSH-017 structure may be created.

## Post-merge state

| Metric | Value |
|---|---:|
| Total units | 67 |
| Accepted | 16 |
| In review | 0 |
| Eligible | 0 |
| Deferred | 51 |
| Remaining | 51 |
| Queue head | RSH-017 |
| RSH-017 authorised | No |
| Current one-unit authority remaining | 0 |
| Release gates | 0/13 |
| Unverified asset files | 66 |

A new explicit owner instruction is required before RSH-017 may be created or executed.
"""
Path("NEXT-CONTRACT.md").write_text(next_contract, encoding="utf-8")

milestone = f"""# RUSH Israel — Milestone Register

**Version:** 4.0.0
**Established by:** RSH-003
**Canonical source:** `MASTER-PLAN.md` and `QUEUE.json`
**RSH-016 implementation base:** `{BASE_SHA}`
**State effective on:** merge of the RSH-016 pull request
**Next eligible unit:** none
**Next scheduled unit:** RSH-017 — deferred and not authorised

## Status vocabulary

- `ACCEPTED`: every unit in the milestone is merged and its exit gate passes.
- `ACTIVE`: exactly one queue-head unit in the milestone is eligible or in review.
- `BLOCKED`: scheduled units may be accepted, but an owner action or exit-gate requirement remains unresolved.
- `AUTHORISED-DEFERRED`: included in a bounded owner instruction but blocked by strict serial execution.
- `DEFERRED`: not eligible under the current queue.

## Version 1 milestones

| ID | Name | Units | Count | Post-merge state | Exit gate |
|---|---|---:|---:|---|---|
| M0 | Control and governance | RSH-001–RSH-003 | 3 | ACCEPTED | Canonical state, queue, governance, baselines and registers agree. |
| M1 | Reproducible toolchain and CI | RSH-004–RSH-008 | 5 | BLOCKED — owner setting | A clean clone passes required CI and `main` is technically protected. |
| M2 | Product scope, licensing and assets | RSH-009–RSH-012 | 4 | ACCEPTED | Scope, package identity, root licence and every shipped asset’s legal status are explicit. |
| M3 | Architecture decomposition | RSH-013–RSH-020 | 8 | DEFERRED — RSH-013–RSH-016 accepted; RSH-017 not authorised | Core responsibilities and resource ownership are separated. |
| M4 | Data integrity and production security | RSH-021–RSH-024 | 4 | DEFERRED | Save data is recoverable and production has no debug or secret exposure. |
| M5 | Ayalon vertical slice | RSH-025–RSH-036 | 12 | DEFERRED | Ayalon is owner-approved, golden-locked and dependency-frozen. |
| M6 | Performance and reliability | RSH-037–RSH-043 | 7 | DEFERRED | Performance, leak, recovery, soak and compatibility targets pass. |
| M7 | UX, accessibility and mobile | RSH-044–RSH-048 | 5 | DEFERRED | Keyboard, touch and gamepad flows pass UX, accessibility and privacy gates. |
| M8 | Eight-track Version 1 content | RSH-049–RSH-062 | 14 | DEFERRED | Eight of eight MVP tracks are driveable, golden-approved and frozen. |
| M9 | Release | RSH-063–RSH-067 | 5 | DEFERRED | All 13 release gates pass and `v1.0.0` has rollback proof. |

## Post-merge program evidence

| Metric | Value |
|---|---:|
| Accepted units | 16 |
| Units in review | 0 |
| Eligible units | 0 |
| Queue head | none |
| Active PR | none |
| Remaining units | 51 |
| RSH-016 one-unit authority | consumed 1/1 |
| Next scheduled unit | RSH-017 — deferred and not authorised |
| Verified release gates | 0/13 |
| Git tags | 0 |
| GitHub Releases | 0 |

## M1 evidence and blocker

RSH-004–RSH-008 are accepted. GitHub still reports `main` unprotected with zero
required status checks and zero rulesets. M1 remains **BLOCKED** until live repository
metadata confirms protection.

## M2 result

| Unit | Status |
|---|---|
| RSH-009 — frozen Version 1 product definition | ACCEPTED — PR #11 |
| RSH-010 — 8 MVP / 48 deferred catalogue classification | ACCEPTED — PR #13 |
| RSH-011 — complete asset provenance and licence inventory | ACCEPTED — PR #14 |
| RSH-012 — README, metadata, branding, root licence and PWA alignment | ACCEPTED — PR #15 |

M2 acceptance means legal status is explicit; it does not mean every asset is cleared.
Exactly 66 public asset files remain unverified and public distribution remains blocked.

## M3 current boundary

| Unit | Status |
|---|---|
| RSH-013 — canonical track schema | ACCEPTED — PR #16 |
| RSH-014 — one module per track | ACCEPTED — PR #17 |
| RSH-015 — world-core extraction | ACCEPTED — PR #18 |
| RSH-016 — isolated world builders per track | ACCEPTED ON MERGE — RSH-016 PR |
| RSH-017–RSH-020 | DEFERRED — NOT AUTHORISED |

The plain `next` authority covers exactly RSH-016 and is consumed on its validated merge.
No unit remains eligible. RSH-017 requires a new explicit owner instruction.

## GitHub-native milestone policy

This file is the canonical milestone definition. GitHub-native milestone objects may
mirror it when connector support exists. A missing GitHub UI object does not change
queue eligibility, accepted-unit counts or gate status.
"""
Path("MILESTONE-REGISTER.md").write_text(milestone, encoding="utf-8")

master_path = Path("MASTER-PLAN.md")
master = master_path.read_text(encoding="utf-8")
replacements = [
    ("**Schema:** 4.0.0", "**Schema:** 5.0.0"),
    ("**RSH-015 implementation base:** `076dabb754dba1676c6685a4a8d6f6d3c0b153ea`", f"**RSH-016 implementation base:** `{BASE_SHA}`"),
    ("**State effective on:** merge of the RSH-015 pull request", "**State effective on:** merge of the RSH-016 pull request"),
    ("**Next unit:** RSH-016 — deferred and not authorised", "**Next unit:** RSH-017 — deferred and not authorised"),
    ("`WORLD-CORE-MANIFEST.json` and `REPOSITORY-GOVERNANCE.md` control program state.", "`WORLD-CORE-MANIFEST.json`, `WORLD-BUILDER-MANIFEST.json` and `REPOSITORY-GOVERNANCE.md` control program state."),
    ("9. The latest explicit owner authority covers exactly RSH-015 and is consumed on its validated merge; RSH-016 is not authorised.", "9. The plain `next` authority covers exactly RSH-016 and is consumed on its validated merge; RSH-017 is not authorised."),
    ("## 5. Post-RSH-015 program state", "## 5. Post-RSH-016 program state"),
    ("| Accepted | 15 |", "| Accepted | 16 |"),
    ("| Deferred | 52 |", "| Deferred | 51 |"),
    ("| Remaining | 52 |", "| Remaining | 51 |"),
    ("| Queue head | RSH-016 — deferred/not authorised |", "| Queue head | RSH-017 — deferred/not authorised |"),
    ("| RSH-015 one-unit authority | 1/1 — consumed |", "| RSH-016 one-unit authority | 1/1 — consumed |"),
    ("| G3 | RSH-013–020 | 8 | Architecture decomposition | DEFERRED — RSH-013–RSH-015 accepted; RSH-016 deferred/not authorised |", "| G3 | RSH-013–020 | 8 | Architecture decomposition | DEFERRED — RSH-013–RSH-016 accepted; RSH-017 deferred/not authorised |"),
]
for old, new in replacements:
    master = must_replace(master, old, new)
master = re.sub(
    r"## 9\. Current execution boundary\n.*\Z",
    f"""## 9. Current execution boundary

RSH-016 is accepted on merge only after exact-head CI and review. It replaces the
6,240-line monolithic `addLandmarks` dispatcher with exactly 56 per-track builder
modules, one registry and one shared-context authority. The accepted RSH-015
`world.ts` reconstructs byte-for-byte, and runtime, track-data, physics, asset and
dependency changes remain zero.

The RSH-016 one-unit `next` authority is then consumed. RSH-017 remains deferred and
cannot start without a new explicit owner instruction.
""",
    master,
    flags=re.S,
)
master_path.write_text(master, encoding="utf-8")

findings_path = Path("FINDINGS-REGISTER.md")
findings = findings_path.read_text(encoding="utf-8")
findings = must_replace(findings, "**Version:** 1.6.0", "**Version:** 1.7.0")
findings = must_replace(findings, "**RSH-013 implementation base:** `94524201dfe87f1f22f8d8bdd9d97aad507c0438`", f"**RSH-016 implementation base:** `{BASE_SHA}`")
findings = must_replace(findings, "**State effective on:** merge of PR #16", "**State effective on:** merge of the RSH-016 pull request")
findings = must_replace(findings, "**Date:** 29 August 2026", "**Date:** 30 August 2026")
findings, n1 = re.subn(r"^\| P1-14 \|.*$", "| P1-14 | P1 | **OPEN** | Core source files are excessively large | RSH-014 split all 56 track modules; RSH-015 extracted the typed world core; RSH-016 replaces the 6,240-line monolithic landmark dispatcher with 56 isolated builders and reduces `world.ts` to 2,790 lines. `engine.ts` and UI decomposition remain pending. | RSH-017 through RSH-018 |", findings, count=1, flags=re.M)
findings, n2 = re.subn(r"^\| P1-15 \|.*$", "| P1-15 | P1 | **OPEN** | Content, rendering, physics, UI and QA are tightly coupled | RSH-013–RSH-016 establish track-schema, per-track-module, world-core and isolated world-builder boundaries with zero runtime drift; engine/UI adapters and complete resource accounting remain pending. | RSH-017 through RSH-020 |", findings, count=1, flags=re.M)
if n1 != 1 or n2 != 1:
    raise RuntimeError("failed to update findings rows")
findings_path.write_text(findings, encoding="utf-8")

contract_path = Path("RSH-016-WORLD-BUILDER-CONTRACT.md")
contract = contract_path.read_text(encoding="utf-8").rstrip()
if "## Authorization and implemented dimensions" not in contract:
    contract += f"""

## Authorization and implemented dimensions

- Owner instruction: plain `next`, interpreted by `QUEUE.json` as exactly one queue-head unit.
- Authorization scope: RSH-016 only; RSH-017 and later units remain unauthorized.
- `src/game/world.ts`: 9,006 lines / 352,625 bytes before; {world_builder["extraction"]["world"]["lines"]:,} lines / {world_builder["extraction"]["world"]["bytes"]:,} bytes after.
- Per-track builder modules: {len(modules)}.
- Per-track builder source: {track_builder_lines:,} lines / {track_builder_bytes:,} bytes.
- Complete builder source including registry, shared context and types: {builder_lines_total:,} lines / {builder_bytes_total:,} bytes.
- Observable runtime-behaviour changes: 0.
- State becomes accepted only on validated merge and successful post-merge required CI.
"""
contract_path.write_text(contract + "\n", encoding="utf-8")

program_path = Path("scripts/program-control.test.mjs")
program = program_path.read_text(encoding="utf-8")
program = program.replace('"merge_of_RSH_015_pull_request"', '"merge_of_RSH_016_pull_request"')
authorization_block = r"""test("the historical batch and both one-unit authorizations are closed", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const expected = ["RSH-010", "RSH-011", "RSH-012", "RSH-013", "RSH-014"];
  assert.deepEqual(current.batch_authorization.authorized_units, expected);
  assert.deepEqual(queue.policy.active_bounded_batch.authorized_units, expected);
  assert.equal(current.batch_authorization.completed_units, 5);
  assert.equal(queue.policy.active_bounded_batch.completed, 5);
  assert.equal(current.batch_authorization.total_units, 5);
  assert.equal(queue.policy.active_bounded_batch.total, 5);
  assert.equal(current.batch_authorization.closed_after, "RSH-014");
  assert.equal(current.batch_authorization["RSH-015_was_separately_authorized"], true);
  assert.equal(current.batch_authorization["RSH-015_authorization_consumed"], true);
  assert.equal(current.batch_authorization["RSH-016_was_separately_authorized"], true);
  assert.equal(current.batch_authorization["RSH-016_authorization_consumed"], true);
  assert.equal(current.batch_authorization["RSH-017_authorized"], false);
  assert.deepEqual(current.prior_single_unit_authorization.authorized_units, ["RSH-015"]);
  assert.equal(current.prior_single_unit_authorization.state, "consumed_on_RSH-015_merge");
  assert.deepEqual(current.single_unit_authorization.authorized_units, ["RSH-016"]);
  assert.equal(current.single_unit_authorization.completed_units, 1);
  assert.equal(current.single_unit_authorization.total_units, 1);
  assert.equal(current.single_unit_authorization.state, "consumed_on_RSH-016_merge");
  assert.equal(queue.next_instruction_contract.authorization_remaining, 0);
  assert.equal(queue.next_instruction_contract.authorization_closed, true);
  assert.equal(queue.state_rules["RSH-001–RSH-016"], "accepted");
  assert.equal(queue.state_rules["RSH-016"], undefined);
  assert.deepEqual(queue.state_rules.eligible, []);
  assert.equal(queue.next_instruction_contract.current_action, "No unit is authorized; RSH-017 remains deferred until a new explicit owner instruction.");
  assert.equal(queue.next_instruction_contract["RSH-016_completed"], true);
  assert.equal(queue.next_instruction_contract["RSH-016_authorization_consumed"], true);
  assert.equal(queue.next_instruction_contract["RSH-017_authorized"], false);
  assert.equal(queue.policy.latest_single_unit_authorization.completed, 1);
  assert.equal(queue.policy.latest_single_unit_authorization.total, 1);
  assert.deepEqual(queue.policy.latest_single_unit_authorization.authorized_units, ["RSH-016"]);
  assert.equal(queue.policy.latest_single_unit_authorization["RSH-017_authorized"], false);
  assert.equal(current.batch_authorization.next_instruction_required, true);
});

"""
program, count = re.subn(r'test\("the historical owner batch is closed and the RSH-015 authority is consumed", \(\) => \{.*?\n\}\);\n\n(?=test\("RSH-007 through RSH-012)', authorization_block, program, count=1, flags=re.S)
if count != 1:
    raise RuntimeError("failed to replace authorization test block")

rsh015_rsh016_blocks = r"""test("RSH-015 evidence is fully reconciled before RSH-016 acceptance", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  const accepted = current.accepted_units["RSH-015"];
  assert.equal(accepted.state, "accepted");
  assert.equal(accepted.pull_request, 18);
  assert.equal(accepted.validated_head_sha, "d061eb6adcf84ddbc9361f4f5fe3b0b5c83b05e4");
  assert.equal(accepted.merge_sha, "973e68d6e1d3fa8ed628f4461cdfae3096d01ea3");
  assert.equal(accepted.tree_sha, "27e88997f6127a045b0c260850cabcf0c0d650fd");
  assert.equal(accepted.workflow_run, 33279513653);
  assert.equal(accepted.workflow_job, 99172185122);
  assert.equal(accepted.artifact_id, 9722594860);
  assert.equal(accepted.post_merge_workflow_run, 33279921857);
  assert.equal(accepted.post_merge_workflow_job, 99173247441);
  assert.equal(accepted.post_merge_artifact_id, 9722713132);
  assert.equal(accepted.unresolved_review_threads, 0);
  assert.equal(queue.accepted["RSH-015"].merge_sha, accepted.merge_sha);
  const entry = baseline.baselines.find((item) => item.id === "B015-rsh-015-accepted");
  assert.equal(entry.commit_sha, accepted.merge_sha);
  assert.equal(entry.validated_head_sha, accepted.validated_head_sha);
});

test("RSH-016 becomes accepted on merge and consumes exactly one authorization", () => {
  const current = readJson("CURRENT-STATE.json");
  const queue = readJson("QUEUE.json");
  const baseline = readJson("BASELINE-REGISTER.json");
  const modules = readJson("TRACK-MODULE-MANIFEST.json");
  const builders = readJson("WORLD-BUILDER-MANIFEST.json");
  assert.equal(queue.counts.accepted, 16);
  assert.equal(queue.counts.in_review, 0);
  assert.equal(queue.counts.eligible, 0);
  assert.equal(queue.counts.deferred, 51);
  assert.equal(queue.counts.remaining, 51);
  assert.equal(queue.queue_head.id, "RSH-017");
  assert.equal(queue.queue_head.state, "deferred_not_authorized");
  assert.equal(queue.queue_head.branch, null);
  assert.equal(queue.queue_head.pull_request, null);
  assert.equal(current.active_change, null);
  assert.equal(current.last_transition.unit, "RSH-016");
  assert.equal(current.last_transition.state, "accepted_on_merge");
  assert.equal(current.accepted_units["RSH-015"].state, "accepted");
  assert.equal(current.accepted_units["RSH-016"].state, "accepted_on_merge");
  assert.equal(current.accepted_units["RSH-016"].world_lines_before, 9006);
  assert.equal(current.accepted_units["RSH-016"].world_lines_after, 2790);
  assert.equal(current.accepted_units["RSH-016"].builder_module_count, 56);
  assert.equal(current.accepted_units["RSH-016"].runtime_behavior_changes, 0);
  assert.equal(modules.modules.length, 56);
  assert.equal(modules.semantic_integrity.runtime_data_changes, 0);
  assert.equal(modules.semantic_integrity.runtime_order_changes, 0);
  assert.equal(builders.extraction.modules.length, 56);
  assert.equal(builders.extraction.world.lines, 2790);
  assert.equal(builders.deferred_boundary.rsh_017_started, false);
  assert.equal(builders.deferred_boundary.rsh_017_authorized, false);
  assert.equal(baseline.working_state.unit, "RSH-016");
  assert.equal(baseline.working_state.state, "accepted_on_merge");
  assert.equal(queue.next_instruction_contract.authorization_remaining, 0);
  assert.equal(queue.next_instruction_contract["RSH-017_authorized"], false);
  assert.equal(queue.next_after_acceptance.id, "RSH-017");
  assert.equal(queue.next_after_acceptance.state, "deferred_not_authorized");
});
"""
program, count = re.subn(r'test\("RSH-015 becomes accepted on merge and consumes exactly one authorization", \(\) => \{.*?\n\}\);\n(?=test\("asset provenance)', rsh015_rsh016_blocks + "\n", program, count=1, flags=re.S)
if count != 1:
    raise RuntimeError("failed to replace RSH-015 acceptance test block")
program_path.write_text(program, encoding="utf-8")

milestone_test = r"""import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fromRoot } from "./project-root.mjs";

function readRegister() {
  return readFileSync(fromRoot("MILESTONE-REGISTER.md"), "utf8");
}

test("milestone register records the consumed RSH-016 authority exactly", () => {
  const register = readRegister();
  assert.match(register, /\*\*Version:\*\* 4\.0\.0/);
  assert.match(register, /\*\*State effective on:\*\* merge of the RSH-016 pull request/);
  assert.match(register, /\*\*Next eligible unit:\*\* none/);
  assert.match(register, /\*\*Next scheduled unit:\*\* RSH-017 — deferred and not authorised/);
  assert.match(register, /\| M3 \| Architecture decomposition \| RSH-013–RSH-020 \| 8 \| DEFERRED — RSH-013–RSH-016 accepted; RSH-017 not authorised \|/);
  assert.match(register, /\| Accepted units \| 16 \|/);
  assert.match(register, /\| Eligible units \| 0 \|/);
  assert.match(register, /\| Queue head \| none \|/);
  assert.match(register, /\| Remaining units \| 51 \|/);
  assert.match(register, /\| RSH-016 one-unit authority \| consumed 1\/1 \|/);
  assert.match(register, /\| RSH-016 — isolated world builders per track \| ACCEPTED ON MERGE — RSH-016 PR \|/);
  assert.match(register, /No unit remains eligible\. RSH-017 requires a new explicit owner instruction\./);
});

test("milestone register contains no stale RSH-016 execution authority", () => {
  const register = readRegister();
  assert.doesNotMatch(register, /Next scheduled unit:\*\* RSH-016/);
  assert.doesNotMatch(register, /\| Accepted units \| 15 \|/);
  assert.doesNotMatch(register, /\| Remaining units \| 52 \|/);
  assert.doesNotMatch(register, /RSH-016 not authorised/);
  assert.doesNotMatch(register, /RSH-016 requires a new explicit owner instruction/);
});
"""
Path("scripts/milestone-register.test.mjs").write_text(milestone_test, encoding="utf-8")

print(json.dumps({
    "generated_at": NOW,
    "track_builder_modules": len(modules),
    "track_builder_lines": track_builder_lines,
    "track_builder_bytes": track_builder_bytes,
    "builder_lines_total": builder_lines_total,
    "builder_bytes_total": builder_bytes_total,
    "world_lines_after": world_builder["extraction"]["world"]["lines"],
    "world_bytes_after": world_builder["extraction"]["world"]["bytes"],
}, indent=2))
