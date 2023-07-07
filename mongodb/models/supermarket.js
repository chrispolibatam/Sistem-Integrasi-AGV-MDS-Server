import mongoose from "mongoose";

const SupermarketSchema = new mongoose.Schema({
  address: { type: String, required: true },
  line: { type: String, required: true },
  status: { type: String, required: true },
  order_date: { type: Time, required: true },
  order_time: { type: Time, required: true },
  duration: { type: Time, required: true },
  photo: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, REF: "User" },
});

const supermarketModel = mongoose.model("Supermarket", "SupermarketSchema");
export default supermarketModel;
