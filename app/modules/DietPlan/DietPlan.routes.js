import { Router } from "express";
import {
  createDiet,
  createFoodHabit,
  createFoodHabitQuestion,
  deleteDiet,
  deleteFoodHabitQuestion,
  getAllDiet,
  getAllDietBySearch,
  getAllDiets,
  getAllFoodHabit,
  getAllFoodHabitQuestions,
  getByIdDiet,
  getByIdFoodHabit,
  getByIdUserDiet,
  getFoodHabitQuestionById,
  updateDiet,
  updateFoodHabit,
  updateFoodHabitQuestion,
} from "./DietPlan.controller.js";

const dietPlanRoutes = Router();
dietPlanRoutes.get("/", getAllDiets);
dietPlanRoutes.get("/get-all", getAllDiet);
dietPlanRoutes.get("/get-diet-by-search", getAllDietBySearch);

dietPlanRoutes.get("/get-id/:id", getByIdDiet);
dietPlanRoutes.get("/get-user-diet/:id", getByIdUserDiet);
dietPlanRoutes.get("/get-food-habit/:id", getByIdFoodHabit);
dietPlanRoutes.post("/get-food-habit/:id", getByIdFoodHabit);
dietPlanRoutes.get("/get-food-habit", getAllFoodHabit);
dietPlanRoutes.put("/update-food-habit/:id", updateFoodHabit);

dietPlanRoutes.post("/post", createDiet);

dietPlanRoutes.delete("/delete/:id", deleteDiet);

dietPlanRoutes.put("/put/:id", updateDiet);

// food habit routes
dietPlanRoutes.post("/create-food-habit", createFoodHabit);
dietPlanRoutes.post("/food-habit-question/create", createFoodHabitQuestion);
dietPlanRoutes.get("/food-habit-question/get", getAllFoodHabitQuestions);
dietPlanRoutes.get(
  "/food-habit-question/get-single/:id",
  getFoodHabitQuestionById
);
dietPlanRoutes.put("/food-habit-question/update/:id", updateFoodHabitQuestion);
dietPlanRoutes.delete(
  "/food-habit-question/delete/:id",
  deleteFoodHabitQuestion
);

export default dietPlanRoutes;
