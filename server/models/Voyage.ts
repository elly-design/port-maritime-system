import mongoose, { Document, Schema } from 'mongoose';

export interface IVoyage extends Document {
  voyageId: string;
  vessel: mongoose.Types.ObjectId;
  departurePort: string;
  destinationPort: string;
  departureTime: Date;
  estimatedArrival: Date;
  actualArrival?: Date;
  status: string;
  cargo: {
    type: string;
    weight: number;
    description: string;
  };
  route: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  }[];
  fuelConsumption: number;
  distance: number;
  crew: mongoose.Types.ObjectId[];
}

const VoyageSchema: Schema = new Schema({
  voyageId: { type: String, required: true, unique: true },
  vessel: { type: Schema.Types.ObjectId, ref: 'Vessel', required: true },
  departurePort: { type: String, required: true },
  destinationPort: { type: String, required: true },
  departureTime: { type: Date, required: true },
  estimatedArrival: { type: Date, required: true },
  actualArrival: { type: Date },
  status: { type: String, required: true, enum: ['Planned', 'In Progress', 'Completed', 'Delayed', 'Cancelled'] },
  cargo: {
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    description: { type: String, required: true }
  },
  route: [{
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, required: true }
  }],
  fuelConsumption: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
  crew: [{ type: Schema.Types.ObjectId, ref: 'Crew' }]
}, { timestamps: true });

export default mongoose.model<IVoyage>('Voyage', VoyageSchema);
