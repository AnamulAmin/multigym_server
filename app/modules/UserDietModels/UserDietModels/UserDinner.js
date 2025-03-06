import mongoose from "mongoose";

const { Schema, model } = mongoose;

const DinnerSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  rice: String,
  roti: String,
  fish_meat: String,
  pulse: String,
  shack: String,
  vegetable: String,
  salad: String,
  extra: String
});

const UserDinner = model("UserDinner", DinnerSchema);

export default UserDinner;
