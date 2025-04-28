import mongoose, { Document, Schema } from 'mongoose';

export interface IMaintenance extends Document {
  maintenanceId: string;
  vessel: mongoose.Types.ObjectId;
  type: string;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: string;
  assignedTechnicians: string[];
  parts: {
    name: string;
    quantity: number;
    cost: number;
  }[];
  totalCost: number;
  notes: string;
}

const MaintenanceSchema: Schema = new Schema({
  maintenanceId: { type: String, required: true, unique: true },
  vessel: { type: Schema.Types.ObjectId, ref: 'Vessel', required: true },
  type: { type: String, required: true, enum: ['Routine', 'Emergency', 'Scheduled', 'Inspection'] },
  description: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  completedDate: { type: Date },
  status: { type: String, required: true, enum: ['Scheduled', 'In Progress', 'Completed', 'Delayed', 'Cancelled'] },
  assignedTechnicians: [{ type: String }],
  parts: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    cost: { type: Number, required: true }
  }],
  totalCost: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);
