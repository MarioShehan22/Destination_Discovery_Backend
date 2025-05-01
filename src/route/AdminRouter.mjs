import express from "express";
import {getDetail} from "../controller/AdminDashboardController.mjs"
import {auth} from "../middleware/auth.mjs";
const router = express.Router();

router.get('/stats',auth,getDetail );

export default router;
