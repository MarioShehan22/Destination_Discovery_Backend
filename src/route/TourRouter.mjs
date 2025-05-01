import {Router} from "express";
import {create,findAll,findById,findByGuideId} from "../controller/TourController.mjs"
import {auth} from "../middleware/auth.mjs";
const router = Router();

router.post('/create',auth, create);
router.get('/find-all',findAll);
router.get('/find-By/:id',findById);
router.get('/find-By-Guide-id/:id',findByGuideId);
export default router;
