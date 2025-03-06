import mongoose from "mongoose";
const { Schema, model } = mongoose;

const transactionTypeSchema = Schema(
  {
    receipt_no: {
      type: String,
      required: [true, "Please Add Receipt no"],
    },
    login_name: {
      type: String,
      required: [true, "Please Add login number"],
    },
    login_email: {
      type: String,
      required: [true, "Please Add Login Email"],
    },
    amount: {
      type: String,
      required: [true, "Please Add amount"],
    },
    voucher: {
      type: String,
      // required: [true, "Please Add voucher"],
    },
    particulars: {
      type: String,
      // required: [true, "Please Add voucher"],
    },

    transaction_date: {
      type: String,
      required: [true, "Please Add Transaction date"],
    },
    payment_method: {
      type: String,
      required: [true, "Please Add payment method"],
    },
    transaction_type: {
      type: String,
      // required: [true, "Please Add voucher"],
    },
    transaction_name: {
      type: String,
      // required: [true, "Please Add voucher"],
    },
    branch: {
      type: String,
      // required: [true, "Please Add voucher"],
    },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionTypeSchema);

export default Transaction;
