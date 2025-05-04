import express from 'express';
import { loginMess, registerMess, listMess } from '../controllers/messController.js';
import messAuthMiddleware from '../middleware/messAuth.js';
import multer from 'multer';

const messRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)



messRouter.post("/login",loginMess);
messRouter.post("/register",registerMess);
messRouter.get("/list",listMess);

export default messRouter;