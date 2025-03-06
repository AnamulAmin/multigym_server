import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SmsTemplateSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    msg: {
      type: String,
      required: [true, "Please add a message"],
    },
    branch: {
      type: String,
      required: [true, "Please add a branch"],
    },
  },
  { timestamps: true }
);

const SmsTemplates = model("SmsTemplates", SmsTemplateSchema);

export default SmsTemplates;
