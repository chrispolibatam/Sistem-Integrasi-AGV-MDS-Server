import Order from "../mongodb/models/order.js";
import User from "../mongodb/models/user.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllOrder = async (req, res) => {
  const { _end, _order, _start, _sort, status_like = "", line = "" } = req.query;
  const query = {};
  if (line !== "") {
    query.line = line;
  }
  if (status_like) {
    query.title = { $regex: status_like, $options: "i" };
  }
  try {
    const count = await Order.countDocuments({ query });
    const order = await Order.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });
    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get detail order
const getOrderDetails = async (req, res) => {
  const { id } = req.params;
  const orderExists = await Order.findOne({ _id: id }).populate("creator");
  if (orderExists) {
    res.status(200).json(orderExists);
  } else {
    res.status(404).json({ mesage: "Order not found" });
  }
};
// create Order
const createOrder = async (req, res) => {
  try {
    const { line, order_date, order_time, order_lead_time, nc, po, troly_remain, qty_bin, bin, status, photo, email } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");
    // UPLOAD FOTO USING CLOUDINARY
    const photoUrl = await cloudinary.uploader.upload(photo);

    const newOrder = await Order.create({
      line,
      order_date,
      order_time,
      order_lead_time,
      nc,
      po,
      troly_remain,
      qty_bin,
      bin,
      status,
      photo: photoUrl.url,
      creator: user._id,
    });

    user.allOrder.push(newOrder._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Order created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, orderType, location, price, photo } = req.body;

    const photoUrl = await cloudinary.uploader.upload(photo);

    await Order.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        orderType,
        location,
        price,
        photo: photoUrl.url || photo,
      }
    );

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const orderToDelete = await Order.findById({ _id: id }).populate("creator");

    if (!orderToDelete) throw new Error("Order not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    orderToDelete.remove({ session });
    orderToDelete.creator.allOrder.pull(orderToDelete);

    await orderToDelete.creator.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllOrder, getOrderDetails, createOrder, updateOrder, deleteOrder };
