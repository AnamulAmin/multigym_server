import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SMSGroupsSchema = new Schema(
  {
    groupName: {
      type: String,
      required: [true, "Please add Group Name"],
    },
    phoneNumbers: [
      {
        name: {
          type: String,
        },
        mobile: {
          type: String,
          required: [true, "Please add Mobile Number"],
          match: [/^\d{10,15}$/, "Please enter a valid mobile number"],
        },
      },
    ],
    branch: {
      type: String,
      required: [true, "Please add Branch"],
    },
    type: {
      type: String,
      required: [true, "Please add Type"],
    },
    status: {
      type: String,
      required: [true, "Please add Status"],
    },
  },
  { timestamps: true }
);

const SMSGroups = model("SMSGroups", SMSGroupsSchema);

export default SMSGroups;
