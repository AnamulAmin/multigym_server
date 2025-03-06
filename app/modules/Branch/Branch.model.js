// Branch.model.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const EmailSettingsSchema = new Schema({
  template: {
    type: String, 
    default: "",
  },
  enabled: {
    type: Boolean, 
    default: false,
  },
});

const BranchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    web: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    branch: {
      type: String,
      required: true,

    },
    announcementBody: {
      type: String,
      default: "", 
    },
    announcementEnabled: {
      type: Boolean,
      default: false, 
    },
    announcementPurpose: {
      type: String,
      default: "", 
    },
    punchDeviceId: {
      type: String,
    },
    punchOutDeviceId: {
      type: String,
    },
    emailSettings: {
      expirationReminder60Days: EmailSettingsSchema,
      birthdayWishes: EmailSettingsSchema,
      subscriptionRenewalReminder: EmailSettingsSchema,
    },
  },
  { timestamps: true }
);

const Branch = model("Branch", BranchSchema);

export default Branch;
