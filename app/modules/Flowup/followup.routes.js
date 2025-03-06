import { Router } from "express";
import {
  createOrUpdateFollowUp,
  getAllFollowUps,
  getFollowUpsByUserId,
  getTodayFollowUps,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
} from "./followup.controller.js";

const FollowUpRoutes = Router();

FollowUpRoutes.get("/", getAllFollowUps);
FollowUpRoutes.get("/user/:userId", getFollowUpsByUserId);
FollowUpRoutes.get("/:id", getFollowUpById);

FollowUpRoutes.post("/", createOrUpdateFollowUp);

FollowUpRoutes.put("/:id", updateFollowUp);

FollowUpRoutes.delete("/:id", deleteFollowUp);
FollowUpRoutes.get("/date/today", getTodayFollowUps);
export default FollowUpRoutes;
