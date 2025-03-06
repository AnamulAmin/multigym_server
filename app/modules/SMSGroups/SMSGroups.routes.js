import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroupByBranch,
  getGroupById,
  removeGroup,
  updateGroup,
} from "./SMSGroups.controller.js";

const SMSGroupsRoutes = Router();

SMSGroupsRoutes.get("/", getAllGroups);
SMSGroupsRoutes.get("/:branch/get-all", getGroupByBranch);
SMSGroupsRoutes.get("/get-id/:id", getGroupById);
SMSGroupsRoutes.post("/post", createGroup);
SMSGroupsRoutes.delete("/delete/:id", removeGroup);
SMSGroupsRoutes.put("/put/:id", updateGroup);

export default SMSGroupsRoutes;
