import express from 'express';
import {
  getAllVoyages,
  getVoyageById,
  createVoyage,
  updateVoyage,
  deleteVoyage,
  updateVoyageStatus,
  addRoutePoint,
  getVoyagesByVessel
} from '../controllers/voyageController';

const router = express.Router();

// GET /api/voyages - Get all voyages
router.get('/', getAllVoyages);

// GET /api/voyages/:id - Get voyage by ID
router.get('/:id', getVoyageById);

// POST /api/voyages - Create a new voyage
router.post('/', createVoyage);

// PUT /api/voyages/:id - Update voyage
router.put('/:id', updateVoyage);

// DELETE /api/voyages/:id - Delete voyage
router.delete('/:id', deleteVoyage);

// PATCH /api/voyages/:id/status - Update voyage status
router.patch('/:id/status', updateVoyageStatus);

// POST /api/voyages/:id/route - Add route point to voyage
router.post('/:id/route', addRoutePoint);

// GET /api/voyages/vessel/:vesselId - Get voyages by vessel
router.get('/vessel/:vesselId', getVoyagesByVessel);

export default router;
