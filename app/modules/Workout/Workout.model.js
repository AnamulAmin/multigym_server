import mongoose from "mongoose";
const { Schema, model } = mongoose;

const difficulties = ["beginner", "intermediate", "advance"];

const muscleGroups = {
  Chest: ["Upper Chest", "Middle Chest", "Lower Chest", "Inner Chest"],
  Stretching: ["Lower Stretching", "Upper Stretching ","Middle Stretching "],
  Back: ["Rhomboids", "Upper Lats", "Middle Lats", "Lower Lats"],
  Legs: ["Quads", "Glutes", "Hamstrings", "Calves"],
  Cardio: [
    "High-Intensity Cardio",
    "Moderate-Intensity Cardio",
    "Low-Intensity Cardio",
    "HIIT Cardio",
  ],
  Abs: ["Upper Abs", "Lower Abs", "Obliques Abs", "Whole Abs"],
  Forearms: ["Flexion", "Extension" , "Brachioradialis"],
  Shoulder: ["Trapezius", "Rear Shoulders", "Side Shoulders", "Front Shoulders"],
  Biceps: ["Long Head", "Short Head", "Brachialis"],
  Triceps: ["Long Triceps", "Medial Tricep", "Lateral Tricep"],
};

const equipments = [
  "None",
  "Barbell",
  "Dumbbell",
  "Kettlebell",
  "Machine",
  "Plate",
  "Resistance Band",
  "Suspension Band",
  "Other",
];

const workoutTypes = [
  "Strength",
  "Cardio",
  "Flexibility",
  "Balance",
  "Endurance",
  "HIIT",
  "Circuit Training",
  "Powerlifting",
  "Bodybuilding",
  "Plyometrics",
];

const WorkoutSchema = new Schema(
  {
    name: {
      type: String,
      // required: [true, "Please add a workout name"],
    },
    type: {
      type: String,
      // required: [true, "Please add a workout type"],
      enum: workoutTypes, // Validate type against workoutTypes
    },
    muscle: {
      type: String,
      // required: [true, "Please add a muscle group"],
      enum: Object.keys(muscleGroups), // Validate muscle against muscleGroups
    },
    submuscle: {
      type: String,
      // required: [true, "Please add a submuscle group"],
      validate: {
        validator: function (v) {
          return muscleGroups[this.muscle].includes(v); // Validate submuscle based on selected muscle group
        },
        message: (props) => `${props.value} is not a valid submuscle for the selected muscle group.`,
      },
    },
    equipment: {
      type: String,
      // required: [true, "Please add equipment type"],
      enum: equipments, // Validate equipment against equipments
    },
    difficulty: {
      type: String,
      // required: [true, "Please add a difficulty level"],
      enum: difficulties, // Validate difficulty against difficulties
    },
    instructions: {
      type: String,
      // required: [true, "Please add workout instructions"],
    },
    photo: {
      type: String,
    },
    video: {
      type: String,
    },
    workout_habit_user_answer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "workout_user_answers",
    },
    workout_routine_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "workout_copy_routines",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    branch: {
      type: String,
      require: [true, "please add branch"]
    }
  },
  { timestamps: true }
);

const Workouts = model("Workouts", WorkoutSchema);

export default Workouts;
