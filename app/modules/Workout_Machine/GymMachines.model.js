import mongoose from "mongoose";
const { Schema, model } = mongoose;

const validCategories = [
  "Cardio Machines",
  "Strength Training Machines",
  "Leg Machines",
  "Chest Machines",
  "Biceps and Triceps Machines",
  "Back Machines",
  "Core Training Equipment",
];

const GymMachineSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a machine name"],
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: {
        values: validCategories,
        message: "{VALUE} is not a valid category",
      },
    },
    branch: {
      type: String,
      required: [true, "Please add a branch"],
    },
  },
  { timestamps: true }
);

const GymMachines = model("GymMachines", GymMachineSchema);

export default GymMachines;
