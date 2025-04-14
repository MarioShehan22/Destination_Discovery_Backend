import {Router} from "express";
import {create} from "../controller/TourController.mjs"
const router = Router();

router.post('/create',create);
// router.get('/find-all',findAll);

export default router;
