
import express from 'express';
import {
    setAvailability,
    getAvailability,
    updateAvailability,
    deleteAvailability,
    bookTimeSlot
} from '../controller/GuideAvailabilityController.mjs';
import {auth} from "../middleware/auth.mjs";

const router = express.Router();

// Guide availability routes
router.post('/set', auth,setAvailability);
router.get('/', auth,getAvailability);
router.put('/:id',auth, updateAvailability);
router.delete('/:id',auth, deleteAvailability);
router.post('/book',auth, bookTimeSlot);

export default router;