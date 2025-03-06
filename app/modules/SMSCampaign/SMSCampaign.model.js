import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SMSCampaignSchema = new Schema({
  campaignName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  trxnId: {
    type: String,
    required: true,
  },
  sendCount: {
    type: Number,
    required: true,
    default: 0,
  },
  send_on: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const SMSCampaign = model("SMSCampaign", SMSCampaignSchema);

export default SMSCampaign;
