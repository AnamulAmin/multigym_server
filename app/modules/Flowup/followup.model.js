import mongoose from "mongoose";
const { Schema, model } = mongoose;

const followUpSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    followUp: [
      {
        date: {
          type: Date,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    nextFollowUpDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Join", "Rejoin", "End", "Pending", "Scheduled"], 
      required: true,
    },
    branch: {
      type: String,
    }
  },
  { timestamps: true }
);

const FollowUp = model("FollowUp", followUpSchema);

export default FollowUp;
