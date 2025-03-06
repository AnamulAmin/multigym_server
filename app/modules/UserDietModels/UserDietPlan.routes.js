import { Router } from "express";
import {
  createUserDiet,
  deleteUserDiet,
  getAllUserDiet,
  getAllUserDiets,
  getByIdUserDiet,
  updateUserDiet,
} from "./UserDietPlan.controller.js";

const userDietPlanRoutes = Router();
userDietPlanRoutes.get("/", getAllUserDiets);
userDietPlanRoutes.get("/get-all", getAllUserDiet);

userDietPlanRoutes.get("/get-id/:id", getByIdUserDiet);

userDietPlanRoutes.post("/post", createUserDiet);

userDietPlanRoutes.delete("/delete/:id", deleteUserDiet);

userDietPlanRoutes.put("/put/:id", updateUserDiet);

export default userDietPlanRoutes;
