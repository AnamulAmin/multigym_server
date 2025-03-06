import mongoose from "mongoose";
const { Schema, model } = mongoose;
const LunchSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  lunch_rice: String,
  fish_meat: String,
  pulse: String,
  shack: String,
  vegetable: String,
  salad: String,
  extra: String
});

const Lunch = model("Lunch", LunchSchema);

export default Lunch;
