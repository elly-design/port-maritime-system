import { Request, Response } from 'express';
import Voyage from '../models/Voyage';

// Get all voyages
export const getAllVoyages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const voyages = await Voyage.find()
      .populate('vessel', 'vesselId name')
      .populate('crew', 'crewId firstName lastName position');
    res.status(200).json(voyages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get voyage by ID
export const getVoyageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const voyage = await Voyage.findOne({ voyageId: req.params.id })
      .populate('vessel', 'vesselId name')
      .populate('crew', 'crewId firstName lastName position');
    
    if (!voyage) {
      res.status(404).json({ message: 'Voyage not found' });
      return;
    }
    
    res.status(200).json(voyage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new voyage
export const createVoyage = async (req: Request, res: Response): Promise<void> => {
  try {
    const voyage = new Voyage(req.body);
    const newVoyage = await voyage.save();
    
    const populatedVoyage = await Voyage.findById(newVoyage._id)
      .populate('vessel', 'vesselId name')
      .populate('crew', 'crewId firstName lastName position');
    
    res.status(201).json(populatedVoyage);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update voyage
export const updateVoyage = async (req: Request, res: Response): Promise<void> => {
  try {
    const voyage = await Voyage.findOneAndUpdate(
      { voyageId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    )
      .populate('vessel', 'vesselId name')
      .populate('crew', 'crewId firstName lastName position');
    
    if (!voyage) {
      res.status(404).json({ message: 'Voyage not found' });
      return;
    }
    
    res.status(200).json(voyage);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete voyage
export const deleteVoyage = async (req: Request, res: Response): Promise<void> => {
  try {
    const voyage = await Voyage.findOneAndDelete({ voyageId: req.params.id });
    
    if (!voyage) {
      res.status(404).json({ message: 'Voyage not found' });
      return;
    }
    
    res.status(200).json({ message: 'Voyage deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update voyage status
export const updateVoyageStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    const voyage = await Voyage.findOneAndUpdate(
      { voyageId: req.params.id },
      { status },
      { new: true, runValidators: true }
    )
      .populate('vessel', 'vesselId name')
      .populate('crew', 'crewId firstName lastName position');
    
    if (!voyage) {
      res.status(404).json({ message: 'Voyage not found' });
      return;
    }
    
    res.status(200).json(voyage);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Add route point to voyage
export const addRoutePoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude } = req.body;
    
    const voyage = await Voyage.findOne({ voyageId: req.params.id });
    
    if (!voyage) {
      res.status(404).json({ message: 'Voyage not found' });
      return;
    }
    
    voyage.route.push({
      latitude,
      longitude,
      timestamp: new Date()
    });
    
    await voyage.save();
    
    res.status(200).json(voyage);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get voyages by vessel
export const getVoyagesByVessel = async (req: Request, res: Response): Promise<void> => {
  try {
    const voyages = await Voyage.find({ vessel: req.params.vesselId })
      .populate('vessel', 'vesselId name')
      .populate('crew', 'crewId firstName lastName position');
    
    res.status(200).json(voyages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
