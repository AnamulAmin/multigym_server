import mongoose from "mongoose";
const { Schema, model } = mongoose;
const DietSchema = new Schema({
  sleep: { type: mongoose.Schema.Types.ObjectId, ref: "BeforeSleep" },
  dinner: { type: mongoose.Schema.Types.ObjectId, ref: "Dinner" },
  lunch: { type: mongoose.Schema.Types.ObjectId, ref: "Lunch" },
  breakfast: { type: mongoose.Schema.Types.ObjectId, ref: "Breakfast" },
  health_metrics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HealthMetrics",
  },
  branch: {type: String},
  dietName: {
    type: String,
    required: [true, "Diet Name is required"],
  },
  doctor: {type: String},
});

const Diet = model("Diet", DietSchema);

export default Diet;
