import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  removeWorkout,
  updateWorkout,
  getWorkoutsByFilter,
} from "./Workout.controller.js";

const WorkoutRoutes = Router();

WorkoutRoutes.get("/", getAllWorkouts);
WorkoutRoutes.get("/filter/:muscle/:submuscle/:equipment", getWorkoutsByFilter);
WorkoutRoutes.get("/get-id/:id", getWorkoutById);
WorkoutRoutes.post("/post", createWorkout);
WorkoutRoutes.delete("/delete/:id", removeWorkout);
WorkoutRoutes.put("/put/:id", updateWorkout);

export default WorkoutRoutes;
