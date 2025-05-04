import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { listOrders, placeOrder,updateStatus,userOrders, verifyOrder, placeOrderCod } from '../controllers/orderController.js';
import messAuthMiddleware from '../middleware/messAuth.js';

const orderRouter = express.Router();

orderRouter.get("/list",messAuthMiddleware,listOrders);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/status",updateStatus);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/placecod",authMiddleware,placeOrderCod);

export default orderRouter;