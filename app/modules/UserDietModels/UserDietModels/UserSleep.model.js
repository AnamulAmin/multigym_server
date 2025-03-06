import mongoose from "mongoose";
const { Schema, model } = mongoose;
const SleepSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  sleep: String,
});

const UserBeforeSleep = model("UserBeforeSleep", SleepSchema);

export default UserBeforeSleep;
