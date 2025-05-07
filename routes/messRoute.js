import express from 'express';
import { loginMess, registerMess, listMess } from '../controllers/messController.js';
import messAuthMiddleware from '../middleware/messAuth.js';
import multer from 'multer';

const messRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)
import { updateMessTheme } from '../controllers/messController.js';

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  }
});

const upload = multer({ storage });



messRouter.post("/login",loginMess);
messRouter.post("/register",registerMess);
messRouter.get("/list",listMess);
// Protected route for mess logo and color theme update
messRouter.post("/theme",  upload.single("image"),messAuthMiddleware, updateMessTheme);

export default messRouter;