import { defineDb } from "astro:db";

// Import table definitions
import { PFU_HHKB_Models } from "./tables/pfu-hhkb-models";
import { Pcbs } from "./tables/pcbs";
import { Controllers } from "./tables/controllers";
import { Plates } from "./tables/plates";
import { Domes } from "./tables/domes";
import { Sliders } from "./tables/sliders";
import { Springs } from "./tables/springs";
import { Cases } from "./tables/cases";
import { Manufacturers } from "./tables/manufacturers";
import { PcbControllerCompatibility } from "./tables/compatibility/pcb-controller";
import { PcbCaseCompatibility } from "./tables/compatibility/pcb-case";
import { PcbPlateCompatibility } from "./tables/compatibility/pcb-plate";

export default defineDb({
  tables: {
    PFU_HHKB_Models,
    Pcbs,
    Controllers,
    Plates,
    Domes,
    Sliders,
    Springs,
    Cases,
    Manufacturers,
    PcbControllerCompatibility,
    PcbCaseCompatibility,
    PcbPlateCompatibility,
  },
});
