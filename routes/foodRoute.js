import express from 'express';
import { addFood, listFood, removeFood, addReviewToFood,toggleDynamicPricing } from '../controllers/foodController.js';
import multer from 'multer';
import messAuthMiddleware from '../middleware/messAuth.js';
import authMiddleware from '../middleware/auth.js'

const foodRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage})

foodRouter.get("/list",messAuthMiddleware, listFood);
foodRouter.post("/add",upload.single('image'),messAuthMiddleware,addFood);
foodRouter.post("/remove",removeFood);
foodRouter.post("/add-review",authMiddleware, addReviewToFood);
foodRouter.post('/toggle-dynamic-pricing', toggleDynamicPricing);


export default foodRouter;