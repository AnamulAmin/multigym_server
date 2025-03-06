import mongoose from "mongoose";
const { Schema, model } = mongoose;

const WorkoutRoutineSchema = new Schema({
  routineName: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advance"],
    required: true,
  },
  days: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  workouts: [{
    day: Number, 
    dayName: String, 
    exercises: [{
      workout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workouts', 
      },
      sets: Number, 
      reps: [Number], 
    }]
  }],
  
  branchName: { 
    type: String,
    required: true
  }
}, { timestamps: true });

const WorkoutRoutine = model("WorkoutRoutine", WorkoutRoutineSchema);

export default WorkoutRoutine;
