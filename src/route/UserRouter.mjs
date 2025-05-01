import express from "express";
import {save,login,findAll} from "../controller/UserController.mjs"
import {auth} from "../middleware/auth.mjs";
const router = express.Router();

router.post('/signIn',save);
router.post('/login',login);
router.get('/find-all',auth,findAll);

export default router;
