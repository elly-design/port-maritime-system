import express from 'express';
import {
  getAllCrew,
  getCrewById,
  createCrew,
  updateCrew,
  deleteCrew,
  assignCrewToVessel,
  getCrewByVessel,
  getCrewWithExpiringCertifications
} from '../controllers/crewController';

const router = express.Router();

// GET /api/crew - Get all crew members
router.get('/', getAllCrew);

// GET /api/crew/:id - Get crew member by ID
router.get('/:id', getCrewById);

// POST /api/crew - Create a new crew member
router.post('/', createCrew);

// PUT /api/crew/:id - Update crew member
router.put('/:id', updateCrew);

// DELETE /api/crew/:id - Delete crew member
router.delete('/:id', deleteCrew);

// PATCH /api/crew/:id/assign - Assign crew to vessel
router.patch('/:id/assign', assignCrewToVessel);

// GET /api/crew/vessel/:vesselId - Get crew by vessel
router.get('/vessel/:vesselId', getCrewByVessel);

// GET /api/crew/expiring-certifications - Get crew with expiring certifications
router.get('/expiring-certifications', getCrewWithExpiringCertifications);

export default router;
