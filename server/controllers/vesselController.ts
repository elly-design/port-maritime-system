import { Request, Response } from 'express';
import Vessel from '../models/Vessel';

// Get all vessels
export const getVessels = async (_req: Request, res: Response): Promise<void> => {
  try {
    const vessels = await Vessel.find();
    res.status(200).json(vessels);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get vessel by ID
export const getVesselById = async (req: Request, res: Response): Promise<void> => {
  try {
    const vessel = await Vessel.findOne({ vesselId: req.params.id });
    if (!vessel) {
      res.status(404).json({ message: 'Vessel not found' });
      return;
    }
    res.status(200).json(vessel);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new vessel
export const createVessel = async (req: Request, res: Response): Promise<void> => {
  try {
    const vessel = new Vessel(req.body);
    const newVessel = await vessel.save();
    res.status(201).json(newVessel);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update vessel
export const updateVessel = async (req: Request, res: Response): Promise<void> => {
  try {
    const vessel = await Vessel.findOneAndUpdate(
      { vesselId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vessel) {
      res.status(404).json({ message: 'Vessel not found' });
      return;
    }
    
    res.status(200).json(vessel);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete vessel
export const deleteVessel = async (req: Request, res: Response): Promise<void> => {
  try {
    const vessel = await Vessel.findOneAndDelete({ vesselId: req.params.id });
    
    if (!vessel) {
      res.status(404).json({ message: 'Vessel not found' });
      return;
    }
    
    res.status(200).json({ message: 'Vessel deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update vessel location
export const updateVesselLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, portName } = req.body;
    
    const vessel = await Vessel.findOneAndUpdate(
      { vesselId: req.params.id },
      { 
        currentLocation: {
          latitude,
          longitude,
          portName
        }
      },
      { new: true, runValidators: true }
    );
    
    if (!vessel) {
      res.status(404).json({ message: 'Vessel not found' });
      return;
    }
    
    res.status(200).json(vessel);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get vessels by status
export const getVesselsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const vessels = await Vessel.find({ status: req.params.status });
    res.status(200).json(vessels);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
