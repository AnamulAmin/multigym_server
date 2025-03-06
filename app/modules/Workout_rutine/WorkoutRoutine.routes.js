import express from "express";
import {
  createRoutine,
  getRoutinesByUser,
  addUserToRoutine,
  getRoutineById, 
  updateRoutine, 
  deleteRoutine, 
  getAllRoutines,
  getRoutinesByBranch, 
  createWorkoutHabit,
  createWorkoutHabitQuestion,
  getAllWorkoutHabitQuestions,
  updateWorkoutHabitQuestion,
  deleteWorkoutHabitQuestion,
  getWorkoutHabitQuestionById,
  getByIdWorkoutHabit,
  getAllWorkoutHabit,
  updateWorkoutHabit,
  getAllWorkoutRoutinesBySearch
} from './WorkoutRoutine.controller.js';

const router = express.Router();

router.post("/create", createRoutine);
router.patch("/:id/add-users", addUserToRoutine);

router.get("/user/:userId", getRoutinesByUser);

router.get("/get-single/:id", getRoutineById);

router.put("/update/:id", updateRoutine);

router.delete("/delete/:id", deleteRoutine);

router.get("/branch/all", getRoutinesByBranch);

router.get("/all/all", getAllRoutines);




router.get("/get-workout-habit-by-search", getAllWorkoutRoutinesBySearch);

router.get("/get-workout-habit/:id", getByIdWorkoutHabit);
router.post("/get-workout-habit/:id", getByIdWorkoutHabit);
router.get("/get-all-workout-habit", getAllWorkoutHabit);
router.put("/update-workout-habit/:id", updateWorkoutHabit);

router.post("/create-workout-habit", createWorkoutHabit);
router.post("/workout-habit-question/create", createWorkoutHabitQuestion);
router.get("/workout-habit-question/get", getAllWorkoutHabitQuestions);
router.get(
  "/workout-habit-question/get-single/:id",
  getWorkoutHabitQuestionById
);
router.put("/workout-habit-question/update/:id", updateWorkoutHabitQuestion);
router.delete(
  "/workout-habit-question/delete/:id",
  deleteWorkoutHabitQuestion
);

export default router;
