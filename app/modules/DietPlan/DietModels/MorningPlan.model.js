import mongoose from "mongoose";
const { Schema, model } = mongoose;
const BreakfastSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  roti: String,
  egg: String,
  vegetable: String,
  fruit: String,
  extra: String,
});

const Breakfast = model("Breakfast", BreakfastSchema);

export default Breakfast;
