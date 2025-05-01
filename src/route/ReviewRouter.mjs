import {Router} from "express";
import { findAll, remove,create} from "../controller/ReviewController.mjs";
import {auth} from "../middleware/auth.mjs";
const router = Router();


router.post('/create',auth, create);
router.get('/find-all',auth,findAll);
//router.put('/update',update);
router.delete('/delete/:id',auth,remove);
//router.get('/find/:id',findById);
export default router;
