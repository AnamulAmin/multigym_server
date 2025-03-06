import mongoose from "mongoose";
const { Schema, model } = mongoose;
const HealthMetricsSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  weight: String,
  height: String,
  ideal_weight: String,
  extra_weight: String,
  bp: String,
  calorie: String,
  water: String,
  sugar: String,
  oil: String,
  suggestion: String,
  food_to_avoid: String,
  points_to_note: String,
  weekly: String,
  vegetables: String,
  fruits: String,
  age: String,
});

const UserHealthMetrics = model("UserHealthMetrics", HealthMetricsSchema);

export default UserHealthMetrics;
