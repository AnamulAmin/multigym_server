import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DeviceLogSchema = Schema(
  {
    deviceLogId: {
      type: Number,
      required: true,
      unique: true,
    },
    memberID: {
      type: String,
      default: null,
    },
    memberName: {
      type: String,
      default: null,
    },
    memberEmail: {
      type: String,
      default: "null",
    },
    memberPic: {
      type: String,
      default: null,
    },
    memberGender:{
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    cardNumber: {
      type: String,
      default: null,
    },
    punchTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    deviceLogType: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    branchName: {
      type: String,
      required: true,
    },
    memberRole: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const DeviceLogs = model("DeviceLogs", DeviceLogSchema);

export default DeviceLogs;
