import mongoose from "mongoose";
const { Schema, model } = mongoose;
const ClassTypeSchema = new Schema({
  name: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: Number, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  branch: { type: String, required: true },
  registered: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      status: {
        type: String,
        enum: ["Present", "Absent", "Not Marked"],
        default: "Not Marked",
      },
      photo: { type: String, required: false },
    },
  ],
});

const Classes = model("Classes", ClassTypeSchema);
export default Classes;


