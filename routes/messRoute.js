import express from 'express';
import { loginMess, registerMess } from '../controllers/messController.js';

const messRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)



messRouter.post("/login",loginMess);
messRouter.post("/register",registerMess);

export default messRouter;