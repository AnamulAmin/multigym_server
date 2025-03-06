import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PackagesTypeSchema = Schema({
  branch: {
    type: String,
    required: [true, "Please Add Branch"],
  },
  name: {
    type: String,
    required: [true, "Please Add Name"],
  },
  schedule: {
    type: String,
    required: [true, "Please Add Schedule"],
  },
  duration: {
    type: Number, 
    required: [true, "Please Add Duration"],
  },
  gender: {
    type: String,
    required: [true, "Please Add Gender"],
  },
  admissionFee: {
    type: Number,
    required: [true, "Please Add Admission Fee"],
  },
  packageFee: {
    type: Number, 
    required: [true, "Please Add Package Fee"],
  },
  amount: {
    type: Number,
    required: [true, "Please Add Total Package Fee"],
  },
  status: {
    type: String,
    required: [true, "Please Add Status"],
    enum: ["active", "inactive"], 
  },
});

const Packages = model("Package", PackagesTypeSchema);

export default Packages;
