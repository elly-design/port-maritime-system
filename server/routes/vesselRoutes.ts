import express from 'express';
import {
  getVessels,
  getVesselById,
  createVessel,
  updateVessel,
  deleteVessel,
  updateVesselLocation,
  getVesselsByStatus
} from '../controllers/vesselController';

const router = express.Router();

// GET /api/vessels - Get all vessels
router.get('/', getVessels);

// GET /api/vessels/:id - Get vessel by ID
router.get('/:id', getVesselById);

// POST /api/vessels - Create a new vessel
router.post('/', createVessel);

// PUT /api/vessels/:id - Update vessel
router.put('/:id', updateVessel);

// DELETE /api/vessels/:id - Delete vessel
router.delete('/:id', deleteVessel);

// PATCH /api/vessels/:id/location - Update vessel location
router.patch('/:id/location', updateVesselLocation);

// GET /api/vessels/status/:status - Get vessels by status
router.get('/status/:status', getVesselsByStatus);

export default router;
