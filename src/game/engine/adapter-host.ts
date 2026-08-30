// RSH-017 keeps RaceEngine state private in engine.ts.
// Adapter functions receive the concrete instance through Function.call;
// this structural host intentionally prevents a duplicate state authority.
export type EngineAdapterHost = any;
