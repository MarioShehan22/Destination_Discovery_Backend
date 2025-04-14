import express from "express";
import {create,findAll} from "../controller/BookingController.mjs"

const router = express.Router();

router.post('/create',create);
router.get('/find-all',findAll);

export default router;
