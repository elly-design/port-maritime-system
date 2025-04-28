import express from 'express';
import {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  updateMaintenanceStatus,
  getMaintenanceByVessel,
  getUpcomingMaintenance
} from '../controllers/maintenanceController';

const router = express.Router();

// GET /api/maintenance - Get all maintenance records
router.get('/', getAllMaintenance);

// GET /api/maintenance/:id - Get maintenance by ID
router.get('/:id', getMaintenanceById);

// POST /api/maintenance - Create a new maintenance record
router.post('/', createMaintenance);

// PUT /api/maintenance/:id - Update maintenance record
router.put('/:id', updateMaintenance);

// DELETE /api/maintenance/:id - Delete maintenance record
router.delete('/:id', deleteMaintenance);

// PATCH /api/maintenance/:id/status - Update maintenance status
router.patch('/:id/status', updateMaintenanceStatus);

// GET /api/maintenance/vessel/:vesselId - Get maintenance by vessel
router.get('/vessel/:vesselId', getMaintenanceByVessel);

// GET /api/maintenance/upcoming - Get upcoming maintenance
router.get('/upcoming/scheduled', getUpcomingMaintenance);

export default router;
