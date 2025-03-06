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
      workout: 
        {
          name: {
            type: String,
            // required: [true, "Please add a workout name"],
          },
          type: {
            type: String,
            // required: [true, "Please add a workout type"],
          },
          muscle: {
            type: String,
            // required: [true, "Please add a muscle group"],
          },
          submuscle: {
            type: String,
            // required: [true, "Please add a submuscle group"],
          },
          equipment: {
            type: String,
            // required: [true, "Please add equipment type"],
          },
          difficulty: {
            type: String,
            // required: [true, "Please add a difficulty level"],
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
          
          isActive: {
            type: Boolean,
            default: false,
          },
          branch: {
            type: String,
            require: [true, "please add branch"]
          }
      },
      sets: Number, 
      reps: [Number], 
    }]
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  
  branchName: { 
    type: String,
    required: true
  }
}, { timestamps: true });

const WorkoutCopyRoutine = mongoose.model.workout_copy_routines || model("workout_copy_routines", WorkoutRoutineSchema);

export default WorkoutCopyRoutine;
