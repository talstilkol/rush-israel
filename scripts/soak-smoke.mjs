#!/usr/bin/env node
process.env.SOAK_CYCLES ??= "2";
await import("./soak-menu-race.mjs");
