import mongoose from "mongoose";
const { Schema, model } = mongoose;

const InvoiceTypeSchema = Schema(
  {
    receipt_no: {
      type: String,
      // unique: true,
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
    package_name: {
      type: String,
      required: [true, "Please Add Package Name"],
    },
    duration: {
      type: String,
      required: [true, "Please Add duration"],
    },
    admissionFee: {
      type: String,
      required: [true, "Please Add admission fee"],
    },
    packageFee: {
      type: String,
      required: [true, "Please Add package fee"],
    },
    amount: {
      type: String,
      required: [true, "Please Add amount"],
    },
    member_email: {
      type: String,
      required: [true, "Please Add member email"],
    },
    member_name: {
      type: String,
      required: [true, "Please Add member name"],
    },
    transaction_date: {
      type: String,
      required: [true, "Please Add transaction"],
    },
    start_date: {
      type: String,
      required: [true, "Please Add start_date"],
    },
    end_date: {
      type: String,
      required: [true, "Please Add end_date"],
    },
    member_doc_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    member_id: {
      type: String,
    },
    discount: {
      type: String,
    },
    branch: {
      type: String,
      required: [true, "Please Add branch name"],
    },
    payment_method: {
      type: String,
      required: [true, "Please Add payment method"],
    },
  },
  { timestamps: true }
);

const Invoice = model("Invoice", InvoiceTypeSchema);

export default Invoice;
