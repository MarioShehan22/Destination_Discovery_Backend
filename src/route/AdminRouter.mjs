import express from "express";
import {getDetail} from "../controller/AdminDashboardController.mjs"
const router = express.Router();

router.get('/stats',getDetail );

export default router;
