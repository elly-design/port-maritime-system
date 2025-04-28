import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vessel from '../models/Vessel';
import Crew from '../models/Crew';
import Voyage from '../models/Voyage';
import Maintenance from '../models/Maintenance';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maritime-management');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const vessels = [
  {
    vesselId: 'V001',
    name: 'Ocean Explorer',
    type: 'Container Ship',
    flag: 'Panama',
    yearBuilt: 2018,
    grossTonnage: 85000,
    length: 300,
    beam: 40,
    draft: 14.5,
    status: 'Active',
    currentLocation: {
      latitude: 25.7617,
      longitude: -80.1918,
      portName: 'Port of Miami'
    }
  },
  {
    vesselId: 'V002',
    name: 'Northern Star',
    type: 'Bulk Carrier',
    flag: 'Liberia',
    yearBuilt: 2015,
    grossTonnage: 65000,
    length: 250,
    beam: 35,
    draft: 12.8,
    status: 'Active',
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      portName: 'Port of New York'
    }
  },
  {
    vesselId: 'V003',
    name: 'Pacific Voyager',
    type: 'Tanker',
    flag: 'Marshall Islands',
    yearBuilt: 2020,
    grossTonnage: 95000,
    length: 320,
    beam: 45,
    draft: 15.2,
    status: 'Maintenance',
    currentLocation: {
      latitude: 37.8044,
      longitude: -122.2711,
      portName: 'Port of Oakland'
    }
  }
];

const crewMembers = [
  {
    crewId: 'C001',
    firstName: 'John',
    lastName: 'Smith',
    nationality: 'American',
    position: 'Captain',
    licenseNumber: 'LIC123456',
    licenseExpiry: new Date('2026-05-15'),
    contactInfo: {
      email: 'john.smith@example.com',
      phone: '+1-555-123-4567',
      address: '123 Main St, Seattle, WA, USA'
    },
    certifications: [
      {
        name: 'Master Mariner',
        issueDate: new Date('2015-03-10'),
        expiryDate: new Date('2025-03-10'),
        issuingAuthority: 'USCG'
      }
    ],
    medicalClearance: {
      status: 'Cleared',
      expiryDate: new Date('2025-12-31')
    }
  },
  {
    crewId: 'C002',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    nationality: 'Spanish',
    position: 'Chief Engineer',
    licenseNumber: 'LIC789012',
    licenseExpiry: new Date('2026-08-20'),
    contactInfo: {
      email: 'maria.rodriguez@example.com',
      phone: '+34-555-678-9012',
      address: '456 Calle Marina, Barcelona, Spain'
    },
    certifications: [
      {
        name: 'Chief Engineer License',
        issueDate: new Date('2016-05-22'),
        expiryDate: new Date('2026-05-22'),
        issuingAuthority: 'Spanish Maritime Authority'
      }
    ],
    medicalClearance: {
      status: 'Cleared',
      expiryDate: new Date('2025-10-15')
    }
  },
  {
    crewId: 'C003',
    firstName: 'Hiroshi',
    lastName: 'Tanaka',
    nationality: 'Japanese',
    position: 'First Officer',
    licenseNumber: 'LIC345678',
    licenseExpiry: new Date('2025-11-30'),
    contactInfo: {
      email: 'hiroshi.tanaka@example.com',
      phone: '+81-555-234-5678',
      address: '789 Harbor View, Yokohama, Japan'
    },
    certifications: [
      {
        name: 'Navigation Officer',
        issueDate: new Date('2017-09-05'),
        expiryDate: new Date('2027-09-05'),
        issuingAuthority: 'Japanese Maritime Bureau'
      }
    ],
    medicalClearance: {
      status: 'Cleared',
      expiryDate: new Date('2026-02-28')
    }
  }
];

const voyages = [
  {
    voyageId: 'VOY001',
    vessel: null, // Will be set after vessel is created
    departurePort: 'Port of Miami',
    destinationPort: 'Port of Rotterdam',
    departureDate: new Date('2025-05-01'),
    estimatedArrival: new Date('2025-05-15'),
    status: 'Scheduled',
    cargo: {
      type: 'Mixed Containers',
      weight: 45000,
      hazardous: false
    },
    crew: [], // Will be set after crew is created
    route: [
      {
        latitude: 25.7617,
        longitude: -80.1918,
        timestamp: new Date('2025-05-01T08:00:00Z')
      },
      {
        latitude: 28.5383,
        longitude: -70.5383,
        timestamp: new Date('2025-05-03T14:30:00Z')
      }
    ]
  },
  {
    voyageId: 'VOY002',
    vessel: null, // Will be set after vessel is created
    departurePort: 'Port of New York',
    destinationPort: 'Port of Singapore',
    departureDate: new Date('2025-05-10'),
    estimatedArrival: new Date('2025-06-05'),
    status: 'Scheduled',
    cargo: {
      type: 'Bulk Grain',
      weight: 55000,
      hazardous: false
    },
    crew: [], // Will be set after crew is created
    route: [
      {
        latitude: 40.7128,
        longitude: -74.0060,
        timestamp: new Date('2025-05-10T10:00:00Z')
      }
    ]
  }
];

const maintenanceRecords = [
  {
    maintenanceId: 'M001',
    vessel: null, // Will be set after vessel is created
    type: 'Engine Overhaul',
    description: 'Complete overhaul of main engine',
    scheduledDate: new Date('2025-06-15'),
    estimatedCompletionDate: new Date('2025-06-25'),
    status: 'Scheduled',
    assignedTechnicians: ['Tech1', 'Tech2'],
    parts: [
      {
        name: 'Piston Rings',
        quantity: 16,
        inStock: true
      },
      {
        name: 'Cylinder Liner',
        quantity: 8,
        inStock: true
      }
    ],
    estimatedCost: 75000
  },
  {
    maintenanceId: 'M002',
    vessel: null, // Will be set after vessel is created
    type: 'Hull Inspection',
    description: 'Regular hull inspection and cleaning',
    scheduledDate: new Date('2025-05-20'),
    estimatedCompletionDate: new Date('2025-05-22'),
    status: 'Scheduled',
    assignedTechnicians: ['Tech3'],
    parts: [],
    estimatedCost: 12000
  }
];

// Function to populate database
const populateDatabase = async (): Promise<void> => {
  try {
    // Clear existing data
    await Vessel.deleteMany({});
    await Crew.deleteMany({});
    await Voyage.deleteMany({});
    await Maintenance.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Add vessels
    const createdVessels = await Vessel.insertMany(vessels);
    console.log(`Added ${createdVessels.length} vessels`);
    
    // Add crew members
    const createdCrew = await Crew.insertMany(crewMembers);
    console.log(`Added ${createdCrew.length} crew members`);
    
    // Update voyages with vessel and crew references
    voyages[0].vessel = createdVessels[0]._id.toString();
    voyages[0].crew = [createdCrew[0]._id.toString(), createdCrew[2]._id.toString()];
    
    voyages[1].vessel = createdVessels[1]._id.toString();
    voyages[1].crew = [createdCrew[1]._id.toString()];
    
    // Add voyages
    const createdVoyages = await Voyage.insertMany(voyages);
    console.log(`Added ${createdVoyages.length} voyages`);
    
    // Update maintenance records with vessel references
    maintenanceRecords[0].vessel = createdVessels[2]._id.toString(); // Pacific Voyager
    maintenanceRecords[1].vessel = createdVessels[0]._id.toString(); // Ocean Explorer
    
    // Add maintenance records
    const createdMaintenance = await Maintenance.insertMany(maintenanceRecords);
    console.log(`Added ${createdMaintenance.length} maintenance records`);
    
    // Update crew with vessel references
    await Crew.findByIdAndUpdate(createdCrew[0]._id, { currentVessel: createdVessels[0]._id });
    await Crew.findByIdAndUpdate(createdCrew[1]._id, { currentVessel: createdVessels[1]._id });
    await Crew.findByIdAndUpdate(createdCrew[2]._id, { currentVessel: createdVessels[0]._id });
    
    console.log('Updated crew with vessel references');
    
    console.log('Database populated successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error(`Error populating database: ${error.message}`);
    process.exit(1);
  }
};

// Run the script
connectDB().then(() => {
  populateDatabase();
});
