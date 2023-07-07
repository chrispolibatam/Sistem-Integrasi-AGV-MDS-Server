import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  line: { type: String, required: true },
  order_date: { type: Date, required: true },
  order_time: { type: Time, required: true },
  order_lead_time: { type: Time, required: true },
  nc: { type: Number, required: true },
  po: { type: Number, required: true },
  troly_remain: { type: Number, required: true },
  qty_bin: { type: Number, required: true },
  bin: { type: Number, required: true },
  status: { type: String, required: true },
  photo: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const orderModel = mongoose.model("Order", OrderSchema);

export default orderModel;
