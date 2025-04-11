import express from "express";
import {save,login} from "../controller/UserController.mjs"
const router = express.Router();


router.post('/',save);
router.post('/login',login);

export default router;
