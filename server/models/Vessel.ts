import mongoose, { Document, Schema } from 'mongoose';

export interface IVessel extends Document {
  vesselId: string;
  name: string;
  type: string;
  flag: string;
  yearBuilt: number;
  grossTonnage: number;
  length: number;
  beam: number;
  draft: number;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    portName?: string;
  };
  lastMaintenance: Date;
  nextScheduledMaintenance: Date;
}

const VesselSchema: Schema = new Schema({
  vesselId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  flag: { type: String, required: true },
  yearBuilt: { type: Number, required: true },
  grossTonnage: { type: Number, required: true },
  length: { type: Number, required: true },
  beam: { type: Number, required: true },
  draft: { type: Number, required: true },
  status: { type: String, required: true, enum: ['Active', 'Maintenance', 'Docked', 'In Transit'] },
  currentLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    portName: { type: String }
  },
  lastMaintenance: { type: Date, default: Date.now },
  nextScheduledMaintenance: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model<IVessel>('Vessel', VesselSchema);
