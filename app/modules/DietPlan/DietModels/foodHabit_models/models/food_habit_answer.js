import mongoose from "mongoose";

const food_habit_Answer_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter the name"],
    },
    value: {
      type: String,
      required: [true, "Please enter the value"],
    },
    branch: {
      type: String,
      required: [true, "Please enter the branch"],
    },
  },
  { timestamps: true }
);

const FoodHabitAnswer = mongoose.model(
  "FoodHabitAnswer",
  food_habit_Answer_schema
);
export default FoodHabitAnswer;
