import { Request, Response } from 'express';
import Crew from '../models/Crew';

// Get all crew members
export const getAllCrew = async (_req: Request, res: Response): Promise<void> => {
  try {
    const crew = await Crew.find().populate('currentVessel', 'vesselId name');
    res.status(200).json(crew);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get crew member by ID
export const getCrewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const crewMember = await Crew.findOne({ crewId: req.params.id }).populate('currentVessel', 'vesselId name');
    if (!crewMember) {
      res.status(404).json({ message: 'Crew member not found' });
      return;
    }
    res.status(200).json(crewMember);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new crew member
export const createCrew = async (req: Request, res: Response): Promise<void> => {
  try {
    const crewMember = new Crew(req.body);
    const newCrewMember = await crewMember.save();
    res.status(201).json(newCrewMember);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update crew member
export const updateCrew = async (req: Request, res: Response): Promise<void> => {
  try {
    const crewMember = await Crew.findOneAndUpdate(
      { crewId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!crewMember) {
      res.status(404).json({ message: 'Crew member not found' });
      return;
    }
    
    res.status(200).json(crewMember);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete crew member
export const deleteCrew = async (req: Request, res: Response): Promise<void> => {
  try {
    const crewMember = await Crew.findOneAndDelete({ crewId: req.params.id });
    
    if (!crewMember) {
      res.status(404).json({ message: 'Crew member not found' });
      return;
    }
    
    res.status(200).json({ message: 'Crew member deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Assign crew to vessel
export const assignCrewToVessel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vesselId } = req.body;
    
    const crewMember = await Crew.findOneAndUpdate(
      { crewId: req.params.id },
      { currentVessel: vesselId },
      { new: true, runValidators: true }
    ).populate('currentVessel', 'vesselId name');
    
    if (!crewMember) {
      res.status(404).json({ message: 'Crew member not found' });
      return;
    }
    
    res.status(200).json(crewMember);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get crew by vessel
export const getCrewByVessel = async (req: Request, res: Response): Promise<void> => {
  try {
    const crew = await Crew.find({ currentVessel: req.params.vesselId }).populate('currentVessel', 'vesselId name');
    res.status(200).json(crew);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get crew members with expiring certifications
export const getCrewWithExpiringCertifications = async (_req: Request, res: Response): Promise<void> => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const crew = await Crew.find({
      $or: [
        { licenseExpiry: { $lte: thirtyDaysFromNow } },
        { 'certifications.expiryDate': { $lte: thirtyDaysFromNow } }
      ]
    }).populate('currentVessel', 'vesselId name');
    
    res.status(200).json(crew);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
