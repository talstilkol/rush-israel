#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fromRoot, projectRoot } from "./project-root.mjs";

export const EXPECTED_MANIFEST_SHA256 = "1742ff613b1b5abc5370cf778a2d9151adad1e7b14e07df66720b6ff2d307609";
export const EXPECTED_PACK_SHA256 = "ce1b6f6c3cb5db8e3695864e5a54df2be480caa8ff852aadc8fb4fd693f920ed";
export const EXPECTED_INDEX_SHA256 = "8326432974994dddd7c3b4015693f1833bd02c7a0a6ebf5c947fd92d8b5efb3e";
export const EXPECTED_OWNER_SHA256 = "c735f363cbbeb3c30c5e7b44d5cf6bf1b3256e32548f434f46215560de6d7f84";
export const EXPECTED_CONTRACT_SHA256 = "0328becc41d5ed9568778a8630ffd06dbea46ee11ce0d7301906616336c64c3d";
export const EXPECTED_CHECKER_TEST_SHA256 = "2ed85bcd3bb4e46485b46b059cb1ebf1d9332d7fba11f870155b8a8142ff1943";
export const EXPECTED_LOCK_SHA256 = "1a9b976bcc38e5bca090398418b6a9bb07bb9eb6e661eff7c83340a787cb2a6b";
export const EXPECTED_HASHALOM_INDEX_SHA256 = "5f63d02f48f85d47916917c5dd6eb29c1c6b559bce6359e1e4f985cad339dc10";
export const EXPECTED_PIXEL_GOLDEN_SHA256 = "a8d05fcda8af97d67689f866a03dda052afb5b09c1181797875ccf7ce67fc621";
export const EXPECTED_PACKAGE_SHA256 = "ae427c122d1e8f4a7b419fa83e7deaab7bfb5c88f200699182f8e3d85cf9df94";
export const EXPECTED_GOLDEN_DIGEST_SHA256 = "d1a09a9b9d4542b4ffd7d6feefcfd21e71a0a9903d12a1002dd728d3432f7a74";
export const DUPLICATE_PLACEHOLDER_HASH = "38a303adb7188d398628e58223973cb31d37ccf37d597da33c8ac442b4052094";
export const PIXEL_FRAMES = ["ayalon-day-g01.png", "ayalon-day-g05.png", "ayalon-day-g07.png", "ayalon-night-g08.png"];
export const PLACEHOLDERS = ["hashalom-g04.png", "hashalom-g05.png", "hashalom-g06.png", "hashalom-ramp.png"];
