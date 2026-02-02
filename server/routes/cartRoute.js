import express from "express";
import authUser from "../middlewares/authUser.js";
import { updateCart } from "../controllers/cartController.js";


const cartRouter = express.Router();

cartRouter.post('/update', authUser, updateCart)
cartRouter.get('/get', authUser, updateCart)

export default cartRouter;