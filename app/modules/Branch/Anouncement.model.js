// Announcement.model.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const AnnouncementSchema = new Schema(
  {
    Announcement: {
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
  },
  { timestamps: true }
);

const AnnouncementModel = model("announcement", AnnouncementSchema);

export default AnnouncementModel;
