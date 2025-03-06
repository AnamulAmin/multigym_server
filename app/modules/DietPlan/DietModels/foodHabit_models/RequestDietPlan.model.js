import mongoose from "mongoose";

const dietSchema = new mongoose.Schema(
  {
    food_habit_user_answer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodHabitUserAnswer",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    set_diet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diet",
    },
    branch: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FoodHabit = mongoose.model("FoodHabit", dietSchema);
export default FoodHabit;
