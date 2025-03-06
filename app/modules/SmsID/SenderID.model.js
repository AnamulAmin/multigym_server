import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SenderIDSchema = Schema(
  {
    ID: {
      type: String,
      // required: [true, "Please Add Sender ID"],
    },
    branch: {
      type: String,
      // required: [true, "Please Add Branch"],
    },
  },
  { timestamps: true }
);

const SenderID = model("SenderID", SenderIDSchema);

export default SenderID;
