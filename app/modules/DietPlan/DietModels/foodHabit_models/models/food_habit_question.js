import mongoose from "mongoose";

const food_habit_question_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter the name"],
    },
    label: {
      type: String,
      required: [true, "Please enter the label"],
    },
    field_type: {
      type: String,
      required: [true, "Please enter the field type"],
    },
    branch: {
      type: String,
      required: [true, "Please enter the branch"],
    },
  },
  { timestamps: true }
);

const FoodHabitQuestion = mongoose.model(
  "FoodHabitQuestion",
  food_habit_question_schema
);
export default FoodHabitQuestion;
