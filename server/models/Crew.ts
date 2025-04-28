import mongoose, { Document, Schema } from 'mongoose';

export interface ICrew extends Document {
  crewId: string;
  firstName: string;
  lastName: string;
  position: string;
  nationality: string;
  dateOfBirth: Date;
  licenseNumber: string;
  licenseExpiry: Date;
  contactNumber: string;
  email: string;
  currentVessel?: mongoose.Types.ObjectId;
  certifications: {
    name: string;
    issuedDate: Date;
    expiryDate: Date;
  }[];
  status: string;
  joinDate: Date;
  contractEndDate: Date;
}

const CrewSchema: Schema = new Schema({
  crewId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  position: { type: String, required: true },
  nationality: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  licenseNumber: { type: String, required: true },
  licenseExpiry: { type: Date, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  currentVessel: { type: Schema.Types.ObjectId, ref: 'Vessel' },
  certifications: [{
    name: { type: String, required: true },
    issuedDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true }
  }],
  status: { type: String, required: true, enum: ['Active', 'On Leave', 'Training', 'Off Duty'] },
  joinDate: { type: Date, required: true },
  contractEndDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model<ICrew>('Crew', CrewSchema);
