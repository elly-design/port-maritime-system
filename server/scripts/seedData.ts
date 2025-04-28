// @ts-nocheck
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vessel from '../models/Vessel.js';
import Crew from '../models/Crew.js';
import Voyage from '../models/Voyage.js';
import Maintenance from '../models/Maintenance.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maritime-management');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Vessel.deleteMany({});
    await Crew.deleteMany({});
    await Voyage.deleteMany({});
    await Maintenance.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create vessels
    const vessel1 = await Vessel.create({
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
      },
      lastMaintenance: new Date('2025-01-15'),
      nextScheduledMaintenance: new Date('2025-05-20')
    });
    
    const vessel2 = await Vessel.create({
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
      },
      lastMaintenance: new Date('2025-02-10'),
      nextScheduledMaintenance: new Date('2025-06-10')
    });
    
    const vessel3 = await Vessel.create({
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
      },
      lastMaintenance: new Date('2025-04-01'),
      nextScheduledMaintenance: new Date('2025-06-15')
    });
    
    console.log('Created vessels');
    
    // Create crew members
    const crew1 = await Crew.create({
      crewId: 'C001',
      firstName: 'John',
      lastName: 'Smith',
      nationality: 'American',
      position: 'Captain',
      dateOfBirth: new Date('1980-05-15'),
      licenseNumber: 'LIC123456',
      licenseExpiry: new Date('2026-05-15'),
      contactNumber: '+1-555-123-4567',
      email: 'john.smith@example.com',
      contactInfo: {
        email: 'john.smith@example.com',
        phone: '+1-555-123-4567',
        address: '123 Main St, Seattle, WA, USA'
      },
      certifications: [
        {
          name: 'Master Mariner',
          issuedDate: new Date('2015-03-10'),
          expiryDate: new Date('2025-03-10'),
          issuingAuthority: 'USCG'
        }
      ],
      medicalClearance: {
        status: 'Cleared',
        expiryDate: new Date('2025-12-31')
      },
      currentVessel: vessel1._id,
      status: 'Active',
      joinDate: new Date('2023-01-15'),
      contractEndDate: new Date('2026-01-15')
    });
    
    const crew2 = await Crew.create({
      crewId: 'C002',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      nationality: 'Spanish',
      position: 'Chief Engineer',
      dateOfBirth: new Date('1985-08-22'),
      licenseNumber: 'LIC789012',
      licenseExpiry: new Date('2026-08-20'),
      contactNumber: '+34-555-678-9012',
      email: 'maria.rodriguez@example.com',
      contactInfo: {
        email: 'maria.rodriguez@example.com',
        phone: '+34-555-678-9012',
        address: '456 Calle Marina, Barcelona, Spain'
      },
      certifications: [
        {
          name: 'Chief Engineer License',
          issuedDate: new Date('2016-05-22'),
          expiryDate: new Date('2026-05-22'),
          issuingAuthority: 'Spanish Maritime Authority'
        }
      ],
      medicalClearance: {
        status: 'Cleared',
        expiryDate: new Date('2025-10-15')
      },
      currentVessel: vessel2._id,
      status: 'Active',
      joinDate: new Date('2022-06-10'),
      contractEndDate: new Date('2025-06-10')
    });
    
    const crew3 = await Crew.create({
      crewId: 'C003',
      firstName: 'Hiroshi',
      lastName: 'Tanaka',
      nationality: 'Japanese',
      position: 'First Officer',
      dateOfBirth: new Date('1988-11-12'),
      licenseNumber: 'LIC345678',
      licenseExpiry: new Date('2025-11-30'),
      contactNumber: '+81-555-234-5678',
      email: 'hiroshi.tanaka@example.com',
      contactInfo: {
        email: 'hiroshi.tanaka@example.com',
        phone: '+81-555-234-5678',
        address: '789 Harbor View, Yokohama, Japan'
      },
      certifications: [
        {
          name: 'Navigation Officer',
          issuedDate: new Date('2017-09-05'),
          expiryDate: new Date('2027-09-05'),
          issuingAuthority: 'Japanese Maritime Bureau'
        }
      ],
      medicalClearance: {
        status: 'Cleared',
        expiryDate: new Date('2026-02-28')
      },
      currentVessel: vessel1._id,
      status: 'Active',
      joinDate: new Date('2023-03-20'),
      contractEndDate: new Date('2026-03-20')
    });
    
    console.log('Created crew members');
    
    // Create voyages
    const _voyage1 = await Voyage.create({
      voyageId: 'VOY001',
      vessel: vessel1._id,
      departurePort: 'Port of Miami',
      destinationPort: 'Port of Rotterdam',
      departureTime: new Date('2025-05-01T08:00:00Z'),
      departureDate: new Date('2025-05-01'),
      estimatedArrival: new Date('2025-05-15'),
      status: 'Planned',
      cargo: {
        type: 'Mixed Containers',
        weight: 45000,
        hazardous: false,
        description: 'Various consumer goods and electronics'
      },
      crew: [crew1._id, crew3._id],
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
      ],
      fuelConsumption: 0,
      distance: 0
    });
    
    const _voyage2 = await Voyage.create({
      voyageId: 'VOY002',
      vessel: vessel2._id,
      departurePort: 'Port of New York',
      destinationPort: 'Port of Singapore',
      departureTime: new Date('2025-05-10T10:00:00Z'),
      departureDate: new Date('2025-05-10'),
      estimatedArrival: new Date('2025-06-05'),
      status: 'Planned',
      cargo: {
        type: 'Bulk Grain',
        weight: 55000,
        hazardous: false,
        description: 'Wheat and corn exports'
      },
      crew: [crew2._id],
      route: [
        {
          latitude: 40.7128,
          longitude: -74.0060,
          timestamp: new Date('2025-05-10T10:00:00Z')
        }
      ],
      fuelConsumption: 0,
      distance: 0
    });
    
    console.log('Created voyages');
    
    // Create maintenance records
    const _maintenance1 = await Maintenance.create({
      maintenanceId: 'M001',
      vessel: vessel3._id,
      type: 'Scheduled',
      description: 'Complete overhaul of main engine',
      scheduledDate: new Date('2025-06-15'),
      estimatedCompletionDate: new Date('2025-06-25'),
      status: 'Scheduled',
      assignedTechnicians: ['Tech1', 'Tech2'],
      parts: [
        {
          name: 'Piston Rings',
          quantity: 16,
          inStock: true,
          cost: 2400
        },
        {
          name: 'Cylinder Liner',
          quantity: 8,
          inStock: true,
          cost: 6000
        }
      ],
      estimatedCost: 75000,
      totalCost: 8400,
      notes: 'Regular maintenance as per manufacturer guidelines'
    });
    
    const _maintenance2 = await Maintenance.create({
      maintenanceId: 'M002',
      vessel: vessel1._id,
      type: 'Inspection',
      description: 'Regular hull inspection and cleaning',
      scheduledDate: new Date('2025-05-20'),
      estimatedCompletionDate: new Date('2025-05-22'),
      status: 'Scheduled',
      assignedTechnicians: ['Tech3'],
      parts: [],
      estimatedCost: 12000,
      totalCost: 0,
      notes: 'Underwater inspection by certified divers'
    });
    
    console.log('Created maintenance records');
    console.log('Database seeded successfully!');
    
    return true;
  } catch (error: any) {
    console.error(`Error seeding database: ${error.message}`);
    return false;
  }
};

// Run the seed function
const runSeed = async () => {
  const connected = await connectDB();
  if (connected) {
    const seeded = await seedDatabase();
    if (seeded) {
      console.log('All done!');
    }
  }
  
  // Disconnect from MongoDB
  await mongoose.disconnect();
  process.exit(0);
};

runSeed();
