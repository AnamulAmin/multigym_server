import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SMSLogSchema = new Schema({
  name: {
    type: String,
    required: false,
    default: "No Name",
  },
  mobile: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  send_on: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    default: "Sent",
  },
  branch: {
    type: String,
    required: true,
  },
  trxnId: {
    type: String, // Assuming trxnId is a string, you can adjust this if needed
    required: true,
  },
});

const SMSLog = model("SMSLog", SMSLogSchema);

export default SMSLog;
