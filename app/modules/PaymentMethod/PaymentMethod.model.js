import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PaymentMethodSchema = new Schema(
  {
    name: { type: String, required: [true, "Please Add Name"] },
    image: { type: String, required: [true, "Please Add Image"] },
    branch: { type: String, required: [true, "Please Add Branch"] },
  },
  { timestamps: true }
);

const PaymentMethod = model("PaymentMethod", PaymentMethodSchema);

export default PaymentMethod;
