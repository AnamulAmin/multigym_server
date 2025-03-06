import mongoose from "mongoose";
const { Schema, model } = mongoose;

const LockerSchema = Schema(
  {
    lockerName: {
      type: String,
      required: [true, "Locker Name is required"],
    },
    group: {
      type: String,
      enum: ["Premium", "Standard", "VIP"],
      required: [true, "Group is required"],
    },
    gender: {
      type: String,
      enum: ["Gents", "Female", "Common"],
      required: [true, "Gender is required"],
    },
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // member_id is optional
    },
    status: {
      type: String,
      enum: ["occupied", "available", "reserved"],
      default: "available",
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
    },
  },
  { timestamps: true }
);

const Locker = model("Locker", LockerSchema);

export default Locker;
