import express from "express";

import { createOrder, deleteOrder, getAllOrder, getOrderDetails, updateOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.route("/").get(getAllOrder);
router.route("/:id").get(getOrderDetails);
router.route("/").post(createOrder);
router.route("/:id").patch(updateOrder);
router.route("/:id").delete(deleteOrder);

export default router;
