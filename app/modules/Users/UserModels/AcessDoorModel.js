import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DoorAccessTypeSchema = Schema(
  {
    role: {
      type: String,
      // required: [true, "Please Add Role"],
    },
    admission_date: {
      type: String,
      // required: [true, "Please Add Admission Date"],
    },

    notes: {
      type: String,
      // required: [true, "Please Add Notes"],
    },
  },
  { timestamps: true }
);

const DoorAccess = model("DoorAccess", DoorAccessTypeSchema);

export default DoorAccess;
