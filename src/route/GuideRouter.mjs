import express from "express";
import {create,findAll,findById,deleteGuide,update} from "../controller/GuideController.mjs"
import {auth} from "../middleware/auth.mjs";

const router = express.Router();

router.post('/create',auth,create);
router.get('/find-all',findAll);
router.put('/update',auth,update);
router.delete('/delete/:id',auth,deleteGuide);
router.get('/find/:id',findById);

export default router;