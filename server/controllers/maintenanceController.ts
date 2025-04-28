import { Request, Response } from 'express';
import Maintenance from '../models/Maintenance';

// Get all maintenance records
export const getAllMaintenance = async (_req: Request, res: Response): Promise<void> => {
  try {
    const maintenanceRecords = await Maintenance.find().populate('vessel', 'vesselId name');
    res.status(200).json(maintenanceRecords);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get maintenance by ID
export const getMaintenanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenance = await Maintenance.findOne({ maintenanceId: req.params.id }).populate('vessel', 'vesselId name');

    if (!maintenance) {
      res.status(404).json({ message: 'Maintenance record not found' });
      return;
    }

    res.status(200).json(maintenance);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new maintenance record
export const createMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenance = new Maintenance(req.body);
    const newMaintenance = await maintenance.save();

    const populatedMaintenance = await Maintenance.findById(newMaintenance._id).populate('vessel', 'vesselId name');

    res.status(201).json(populatedMaintenance);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update maintenance record
export const updateMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenance = await Maintenance.findOneAndUpdate(
      { maintenanceId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('vessel', 'vesselId name');

    if (!maintenance) {
      res.status(404).json({ message: 'Maintenance record not found' });
      return;
    }

    res.status(200).json(maintenance);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete maintenance record
export const deleteMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenance = await Maintenance.findOneAndDelete({ maintenanceId: req.params.id });

    if (!maintenance) {
      res.status(404).json({ message: 'Maintenance record not found' });
      return;
    }

    res.status(200).json({ message: 'Maintenance record deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update maintenance status
export const updateMaintenanceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, completedDate } = req.body;

    const updateData: any = { status };

    if (status === 'Completed' && completedDate) {
      updateData.completedDate = completedDate;
    }

    const maintenance = await Maintenance.findOneAndUpdate(
      { maintenanceId: req.params.id },
      updateData,
      { new: true, runValidators: true }
    ).populate('vessel', 'vesselId name');

    if (!maintenance) {
      res.status(404).json({ message: 'Maintenance record not found' });
      return;
    }

    res.status(200).json(maintenance);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get maintenance by vessel
export const getMaintenanceByVessel = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenanceRecords = await Maintenance.find({ vessel: req.params.vesselId }).populate('vessel', 'vesselId name');
    res.status(200).json(maintenanceRecords);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get upcoming maintenance
export const getUpcomingMaintenance = async (_req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const maintenanceRecords = await Maintenance.find({
      scheduledDate: { $gte: today, $lte: thirtyDaysFromNow },
      status: { $in: ['Scheduled', 'Delayed'] }
    }).populate('vessel', 'vesselId name');

    res.status(200).json(maintenanceRecords);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
