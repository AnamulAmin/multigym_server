import mongoose from "mongoose";

const workout_Answer_schema = new mongoose.Schema(
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

const WorkoutAnswerModel = mongoose.model.workout_answers || mongoose.model(
  "workout_answers",
  workout_Answer_schema
);
export default WorkoutAnswerModel;
