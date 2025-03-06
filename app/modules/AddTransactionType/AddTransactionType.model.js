import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TransactionTypeSchema = new Schema(
  {
    value: { type: String, required: [true, "Please Add Value"] },
    label: { type: String, required: [true, "Please Add Label"] },
    type: { type: String, required: [true, "Please Add Type"] },
    branch: { type: String, required: [true, "Please Add Branch"] },
  },
  { timestamps: true }
);

const TransactionType = model("TransactionType", TransactionTypeSchema);

export default TransactionType;
