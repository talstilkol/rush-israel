import { scatterStreetBuildings } from "../buildings";
import type { TrackId } from "../types";
import { createTrackWorldBuilderContext, type TrackWorldBuilderContext } from "./shared";
import type { TrackWorldBuilderInput } from "./types";
import buildHayarkon from "./tracks/hayarkon";
import buildOldjaffa from "./tracks/oldjaffa";
import buildTelaviv from "./tracks/telaviv";
import buildNamal from "./tracks/namal";
import buildJerusalem from "./tracks/jerusalem";
import buildHaifa from "./tracks/haifa";
import buildEilat from "./tracks/eilat";
import buildRothschild from "./tracks/rothschild";
import buildAyalon from "./tracks/ayalon";
import buildCaesarea from "./tracks/caesarea";
import buildDeadsea from "./tracks/deadsea";
import buildAcre from "./tracks/acre";
import buildCentralpark from "./tracks/centralpark";
import buildTimessquare from "./tracks/timessquare";
import buildBrooklynbridge from "./tracks/brooklynbridge";
import buildManhattan from "./tracks/manhattan";
import buildBeersheva from "./tracks/beersheva";
import buildNetanya from "./tracks/netanya";
import buildHw1 from "./tracks/hw1";
import buildHerzliya from "./tracks/herzliya";
import buildHanikra from "./tracks/hanikra";
import buildHaifaport from "./tracks/haifaport";
import buildStellamaris from "./tracks/stellamaris";
import buildTiberias from "./tracks/tiberias";
import buildGolan from "./tracks/golan";
import buildHermon from "./tracks/hermon";
import buildHw6 from "./tracks/hw6";
import buildHw2 from "./tracks/hw2";
import buildHw90 from "./tracks/hw90";
import buildPetah from "./tracks/petah";
import buildRishon from "./tracks/rishon";
import buildAshdod from "./tracks/ashdod";
import buildAshkelon from "./tracks/ashkelon";
import buildScopus from "./tracks/scopus";
import buildWalls from "./tracks/walls";
import buildModiin from "./tracks/modiin";
import buildRamon from "./tracks/ramon";
import buildHw40 from "./tracks/hw40";
import buildEilatmtn from "./tracks/eilatmtn";
import buildGushdan from "./tracks/gushdan";
import buildNazareth from "./tracks/nazareth";
import buildTzfat from "./tracks/tzfat";
import buildMasada from "./tracks/masada";
import buildBatyam from "./tracks/batyam";
import buildRehovot from "./tracks/rehovot";
import buildNahariya from "./tracks/nahariya";
import buildRamla from "./tracks/ramla";
import buildHolon from "./tracks/holon";
import buildBeitshan from "./tracks/beitshan";
import buildHadera from "./tracks/hadera";
import buildLod from "./tracks/lod";
import buildKshmona from "./tracks/kshmona";
import buildRaanana from "./tracks/raanana";
import buildAfula from "./tracks/afula";
import buildKsaba from "./tracks/ksaba";
import buildArad from "./tracks/arad";

type TrackWorldBuilder = (context: TrackWorldBuilderContext) => void;

export const WORLD_BUILDER_IDS = [
  "hayarkon",
  "oldjaffa",
  "telaviv",
  "namal",
  "jerusalem",
  "haifa",
  "eilat",
  "rothschild",
  "ayalon",
  "caesarea",
  "deadsea",
  "acre",
  "centralpark",
  "timessquare",
  "brooklynbridge",
  "manhattan",
  "beersheva",
  "netanya",
  "hw1",
  "herzliya",
  "hanikra",
  "haifaport",
  "stellamaris",
  "tiberias",
  "golan",
  "hermon",
  "hw6",
  "hw2",
  "hw90",
  "petah",
  "rishon",
  "ashdod",
  "ashkelon",
  "scopus",
  "walls",
  "modiin",
  "ramon",
  "hw40",
  "eilatmtn",
  "gushdan",
  "nazareth",
  "tzfat",
  "masada",
  "batyam",
  "rehovot",
  "nahariya",
  "ramla",
  "holon",
  "beitshan",
  "hadera",
  "lod",
  "kshmona",
  "raanana",
  "afula",
  "ksaba",
  "arad",
] as const satisfies readonly TrackId[];

const WORLD_BUILDERS = {
  "hayarkon": buildHayarkon,
  "oldjaffa": buildOldjaffa,
  "telaviv": buildTelaviv,
  "namal": buildNamal,
  "jerusalem": buildJerusalem,
  "haifa": buildHaifa,
  "eilat": buildEilat,
  "rothschild": buildRothschild,
  "ayalon": buildAyalon,
  "caesarea": buildCaesarea,
  "deadsea": buildDeadsea,
  "acre": buildAcre,
  "centralpark": buildCentralpark,
  "timessquare": buildTimessquare,
  "brooklynbridge": buildBrooklynbridge,
  "manhattan": buildManhattan,
  "beersheva": buildBeersheva,
  "netanya": buildNetanya,
  "hw1": buildHw1,
  "herzliya": buildHerzliya,
  "hanikra": buildHanikra,
  "haifaport": buildHaifaport,
  "stellamaris": buildStellamaris,
  "tiberias": buildTiberias,
  "golan": buildGolan,
  "hermon": buildHermon,
  "hw6": buildHw6,
  "hw2": buildHw2,
  "hw90": buildHw90,
  "petah": buildPetah,
  "rishon": buildRishon,
  "ashdod": buildAshdod,
  "ashkelon": buildAshkelon,
  "scopus": buildScopus,
  "walls": buildWalls,
  "modiin": buildModiin,
  "ramon": buildRamon,
  "hw40": buildHw40,
  "eilatmtn": buildEilatmtn,
  "gushdan": buildGushdan,
  "nazareth": buildNazareth,
  "tzfat": buildTzfat,
  "masada": buildMasada,
  "batyam": buildBatyam,
  "rehovot": buildRehovot,
  "nahariya": buildNahariya,
  "ramla": buildRamla,
  "holon": buildHolon,
  "beitshan": buildBeitshan,
  "hadera": buildHadera,
  "lod": buildLod,
  "kshmona": buildKshmona,
  "raanana": buildRaanana,
  "afula": buildAfula,
  "ksaba": buildKsaba,
  "arad": buildArad,
} satisfies Record<TrackId, TrackWorldBuilder>;

export function buildTrackWorld(id: TrackId, context: TrackWorldBuilderContext): void {
  WORLD_BUILDERS[id](context);
}

export function addLandmarks(input: TrackWorldBuilderInput): void {
  const context = createTrackWorldBuilderContext(input);
  buildTrackWorld(input.def.id, context);
  const { def, built, add, hit, isNight, colliders } = context;
  /* RSH-016:BEGIN-LEGACY-FINAL */scatterStreetBuildings(def, built, add, hit, isNight, (x, z) => {
    for (const c of colliders) {
      if (Math.hypot(c.x - x, c.z - z) < (c.r ?? 6) + 14) return true;
    }
    return false;
  });/* RSH-016:END-LEGACY-FINAL */
}
