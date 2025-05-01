import {Router} from "express";
import {deleteLocation, findAll, findById, update,create} from "../controller/LocationController.mjs";
import {auth} from "../middleware/auth.mjs";
const router = Router();


router.post('/create',auth, create);
router.get('/find-all',findAll);
router.put('/update',auth,update);
router.delete('/delete/:id',auth,deleteLocation);
router.get('/find/:id',findById);
export default router;

