import mongoose from "mongoose";
const { Schema, model } = mongoose;
const DietSchema = new Schema({
  sleep: { type: mongoose.Schema.Types.ObjectId, ref: "UserBeforeSleep" },
  dinner: { type: mongoose.Schema.Types.ObjectId, ref: "UserDinner" },
  lunch: { type: mongoose.Schema.Types.ObjectId, ref: "UserLunch" },
  breakfast: { type: mongoose.Schema.Types.ObjectId, ref: "UserBreakfast" },
  health_metrics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserHealthMetrics",
  },
  branch: {type: String},
  dietName: {
    type: String,
    required: [true, "Diet Name is required"],
  },
});

const UserMergeDiet = model("user_diet" ,DietSchema);

export default UserMergeDiet;


