export type TrackId =
  | "hayarkon"
  | "oldjaffa"
  | "telaviv"
  | "namal"
  | "jerusalem"
  | "haifa"
  | "eilat"
  | "rothschild"
  | "ayalon"
  | "caesarea"
  | "deadsea"
  | "acre"
  | "beersheva"
  | "netanya"
  | "hw1"
  | "herzliya"
  | "hanikra"
  | "haifaport"
  | "stellamaris"
  | "tiberias"
  | "golan"
  | "hermon"
  | "hw6"
  | "hw2"
  | "hw90"
  | "petah"
  | "rishon"
  | "ashdod"
  | "ashkelon"
  | "scopus"
  | "walls"
  | "modiin"
  | "ramon"
  | "hw40"
  | "eilatmtn"
  | "gushdan"
  | "nazareth"
  | "tzfat"
  | "masada"
  | "batyam"
  | "rehovot"
  | "nahariya"
  | "ramla"
  | "holon"
  | "beitshan"
  | "hadera"
  | "lod"
  | "kshmona"
  | "raanana"
  | "afula"
  | "ksaba"
  | "arad"
  | "centralpark"
  | "timessquare"
  | "brooklynbridge"
  | "manhattan";

export type HandlingMode = "arcade" | "simcade";
export type AssistFlags = { abs: boolean; tcs: boolean; esc: boolean };
export type Quality = "low" | "mid" | "high";
export type Collider = { x: number; z: number; r: number; kind?: "building" | "barrier" | "car"; hx?: number; hz?: number; yaw?: number };
export type Ramp = {
  x: number;
  z: number;
  sx: number;
  sz: number;
  len: number;
  half: number;
  y0: number;
  y1: number;
  he: string;
  en: string;
};
export type CityId = "telaviv" | "jerusalem" | "haifa" | "eilat" | "caesarea" | "deadsea" | "acre" | "beersheva" | "netanya" | "highway" | "herzliya" | "galilee" | "kinneret" | "golan" | "petah" | "rishon" | "ashdod" | "ashkelon" | "modiin" | "negev" | "rehovot" | "ramla" | "nyc";
export type CarId = "sabra" | "carmel" | "kfir" | "negev" | "yam";
export type RaceMode = "circuit" | "time" | "drift" | "knockout" | "heat" | "roam";
export type Weather = "clear" | "rain" | "storm" | "hamsin";
export type Tune = { engine: number; tires: number; nitro: number; paint: number; livery: number };

export type Vec2 = { x: number; z: number };

export type StreetSeg = { from: number; to: number; he: string; en: string };

export type Poi = { x: number; z: number; r: number; he: string; en: string };

export type SkyPreset = {
  elevation: number;
  azimuth: number;
  turbidity: number;
  rayleigh: number;
  mieCoefficient: number;
  mieDirectionalG: number;
  exposure: number;
  fog: number;
  fogDensity: number;
};

export type WaterBody = { x: number; z: number; w: number; d: number; color: number };

export type TrackDef = {
  id: TrackId;
  nameHe: string;
  nameEn: string;
  city: CityId;
  cityHe: string;
  cityEn: string;
  lengthHint: string;
  description: string;
  descriptionEn: string;
  image: string;
  width: number;
  points: Vec2[];
  elevation: (t: number) => number;
  sky: SkyPreset;
  ground: number;
  sand: number;
  water?: WaterBody;
  waters?: WaterBody[];
  clearZones?: { x: number; z: number; w: number; d: number }[];
  streets: StreetSeg[];
  pois: Poi[];
  checkpointCount: number;
  seed: number;
  theme: "bauhaus" | "stone" | "carmel" | "desert" | "jaffa" | "port" | "highway" | "manhattan" | "park" | "snow";
  open?: boolean;
};

export type CarDef = {
  id: CarId;
  nameHe: string;
  nameEn: string;
  tagline: string;
  color: number;
  accent: number;
  maxSpeed: number;
  accel: number;
  brake: number;
  turnRate: number;
  grip: number;
  drag: number;
  mass: number;
  body: "gt" | "hatch" | "rally" | "super" | "muscle" | "ev";
  /** Claimed 0–100 km/h in seconds. Drive pull is scaled to this. */
  zeroTo100: number;
  nitroDrain?: number;
  nitroStart?: number;
  kit?: "police" | "taxi";
};

export type InputState = {
  steer: number;
  throttle: number;
  brake: number;
  drift: boolean;
  nitro: boolean;
};

export type HudState = {
  speedKmh: number;
  lap: number;
  totalLaps: number;
  lapTime: number;
  bestLap: number;
  totalTime: number;
  position: number;
  totalRacers: number;
  street: string;
  poi: string;
  night: boolean;
  driftCharge: number;
  nitro: number;
  boosting: boolean;
  drifting: boolean;
  wrongWay: boolean;
  countdown: number;
  finished: boolean;
  place: number;
  onTrack: boolean;
  sideStreet: string;
  minimap: { x: number; z: number; yaw: number; isPlayer: boolean; traffic?: boolean; cop?: boolean }[];
  trackPoly: { x: number; z: number }[];
  progress: number;
  mode: RaceMode;
  driftScore: number;
  heat: number;
  heatMax: number;
  busted: boolean;
  chasing: boolean;
  copCount: number;
  cooldown: number;
  wanted: number;
  escaping: boolean;
  knockoutAlive: number;
  weather: Weather;
  ghost: boolean;
  ghostDelta: number;
  drafting: boolean;
  damage: number;
  replay: boolean;
  camName: string;
  rewind: boolean;
  rewinds: number;
  photo: boolean;
  photoFilter: string;
  photoHide: boolean;
  radio: string;
  rpm: number;
  cycle: boolean;
  replaySlow: boolean;
  checkpointPing: number;
  rivalName: string;
  rivalGap: number;
  sector: number;
  sectorDelta: number;
  gear: number;
  surface: string;
  tod: string;
  dirt: number;
  banter: string;
  combo: number;
  driftBonus: string;
  driftAngle: number;
  poiHunt: number;
  poiNeed: number;
  ghostRival: boolean;
  ghostRivalDelta: number;
  navAngle: number;
  handling: HandlingMode;
  absOn: boolean;
  tcsOn: boolean;
  escOn: boolean;
  absActive: boolean;
  tcsActive: boolean;
  escActive: boolean;
  slipRatio: number;
  physicsHz: number;
  msP95: number;
  backend: string;
};

export type RaceResult = {
  place: number;
  totalTime: number;
  bestLap: number;
  laps: number[];
  trackId: TrackId;
  carId: CarId;
  mode: RaceMode;
  driftScore: number;
  busted: boolean;
  heatMax: number;
  eventId?: string;
  weather: Weather;
  cash: number;
  ghostBeaten: boolean;
  line: string;
  eligible?: boolean;
};

export type Sample = {
  x: number;
  y: number;
  z: number;
  tx: number;
  tz: number;
  rx: number;
  rz: number;
  t: number;
  s: number;
};
