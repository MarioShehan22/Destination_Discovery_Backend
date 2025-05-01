import express from "express";
import {create,findAll,updateBookingPaymentStatus,updateBookingStatus,findById,getBookingsForGuide} from "../controller/BookingController.mjs"
import {auth} from "../middleware/auth.mjs";

const router = express.Router();

router.post('/create',auth,create);
router.get('/find-all',auth,findAll);
router.put('/update-booking-status/:id',auth,updateBookingStatus);
router.put('/update-payment-status/:id',auth,updateBookingPaymentStatus);
router.get('/find/:id',auth,findById);
// router.get('/guide/:guideId', getBookingsForGuide);

export default router;
