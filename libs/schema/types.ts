import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as tables from './index';

// Select types (for reading from database)
export type Manufacturer = InferSelectModel<typeof tables.manufacturers>;
export type PCB = InferSelectModel<typeof tables.pcbs>;
export type Controller = InferSelectModel<typeof tables.controllers>;
export type Plate = InferSelectModel<typeof tables.plates>;
export type Dome = InferSelectModel<typeof tables.domes>;
export type Slider = InferSelectModel<typeof tables.sliders>;
export type Spring = InferSelectModel<typeof tables.springs>;
export type Case = InferSelectModel<typeof tables.cases>;
export type PfuHhkbModel = InferSelectModel<typeof tables.pfuHhkbModels>;

// Insert types (for writing to database)
export type NewManufacturer = InferInsertModel<typeof tables.manufacturers>;
export type NewPCB = InferInsertModel<typeof tables.pcbs>;
export type NewController = InferInsertModel<typeof tables.controllers>;
export type NewPlate = InferInsertModel<typeof tables.plates>;
export type NewDome = InferInsertModel<typeof tables.domes>;
export type NewSlider = InferInsertModel<typeof tables.sliders>;
export type NewSpring = InferInsertModel<typeof tables.springs>;
export type NewCase = InferInsertModel<typeof tables.cases>;
export type NewPfuHhkbModel = InferInsertModel<typeof tables.pfuHhkbModels>;

// Compatibility types
export type PcbControllerCompatibility = InferSelectModel<typeof tables.pcbControllerCompatibility>;
export type PcbCaseCompatibility = InferSelectModel<typeof tables.pcbCaseCompatibility>;
export type PcbPlateCompatibility = InferSelectModel<typeof tables.pcbPlateCompatibility>;

export type NewPcbControllerCompatibility = InferInsertModel<typeof tables.pcbControllerCompatibility>;
export type NewPcbCaseCompatibility = InferInsertModel<typeof tables.pcbCaseCompatibility>;
export type NewPcbPlateCompatibility = InferInsertModel<typeof tables.pcbPlateCompatibility>;
