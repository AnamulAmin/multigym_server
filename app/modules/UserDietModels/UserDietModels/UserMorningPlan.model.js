import mongoose from "mongoose";
const { Schema, model } = mongoose;
const BreakfastSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  roti: String,
  egg: String,
  vegetable: String,
  fruit: String,

  extra: String
});

const UserBreakfast = model("UserBreakfast", BreakfastSchema);

export default UserBreakfast;
