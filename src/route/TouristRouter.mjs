import express from "express";
import {create,findAll} from "../controller/TouristController.mjs"
import {auth} from "../middleware/auth.mjs";
const router = express.Router();

router.post('/create', auth,create);
router.get('/find-all',auth, findAll);

export default router;