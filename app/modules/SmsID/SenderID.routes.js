import { Router } from "express";
import {
  createSenderID,
  getAllSenderIDs,
  getSenderIDsByBranch,
  getSenderIDById,
  removeSenderID,
  updateSenderID,
} from "./SenderID.controller.js";

const SenderIDRoutes = Router();

SenderIDRoutes.get("/", getAllSenderIDs);
SenderIDRoutes.get("/:branch/get-all", getSenderIDsByBranch);

SenderIDRoutes.get("/get-id/:id", getSenderIDById);

SenderIDRoutes.post("/post", createSenderID);

SenderIDRoutes.delete("/delete/:id", removeSenderID);

SenderIDRoutes.put("/put/:id", updateSenderID);

export default SenderIDRoutes;
