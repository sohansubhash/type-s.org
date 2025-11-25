import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as tables from "./index";

// Select types (for reading from database)
export type Manufacturer = InferSelectModel<typeof tables.manufacturers>;
export type PCB = InferSelectModel<typeof tables.pcbs>;
export type Controller = InferSelectModel<typeof tables.controllers>;
export type Plate = InferSelectModel<typeof tables.plates>;
export type Dome = InferSelectModel<typeof tables.domes>;
export type Slider = InferSelectModel<typeof tables.sliders>;
export type Spring = InferSelectModel<typeof tables.springs>;
export type Ring = InferSelectModel<typeof tables.rings>;
export type Housing = InferSelectModel<typeof tables.housings>;
export type SbStab = InferSelectModel<typeof tables.sbStabs>;
export type Wire = InferSelectModel<typeof tables.wires>;
export type Case = InferSelectModel<typeof tables.cases>;
export type HHKBModel = InferSelectModel<typeof tables.hhkbModels>;

// Insert types (for writing to database)
export type NewManufacturer = InferInsertModel<typeof tables.manufacturers>;
export type NewPCB = InferInsertModel<typeof tables.pcbs>;
export type NewController = InferInsertModel<typeof tables.controllers>;
export type NewPlate = InferInsertModel<typeof tables.plates>;
export type NewDome = InferInsertModel<typeof tables.domes>;
export type NewSlider = InferInsertModel<typeof tables.sliders>;
export type NewSpring = InferInsertModel<typeof tables.springs>;
export type NewRing = InferInsertModel<typeof tables.rings>;
export type NewHousing = InferInsertModel<typeof tables.housings>;
export type NewSbStab = InferInsertModel<typeof tables.sbStabs>;
export type NewWire = InferInsertModel<typeof tables.wires>;
export type NewCase = InferInsertModel<typeof tables.cases>;
export type NewHHKBModel = InferInsertModel<typeof tables.hhkbModels>;
