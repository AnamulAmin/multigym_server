import { Router } from "express";
import {
  getAllBranches,
  getBranchByCode,
  createBranch,
  updateBranch,
  deleteBranch,
  getEmailSettingsByBranchCode,
  updateEmailSettings,
  updateAnnouncement,
} from "./Branch.controller.js";

const BranchRoutes = Router();

BranchRoutes.get("/", getAllBranches);

BranchRoutes.get("/:branchcode", getBranchByCode);

BranchRoutes.post("/", createBranch);

BranchRoutes.put("/:id", updateBranch);

BranchRoutes.delete("/:id", deleteBranch);

BranchRoutes.put("/:branchcode/email-settings", updateEmailSettings);

BranchRoutes.get("/:branchcode/email-settings", getEmailSettingsByBranchCode);

BranchRoutes.put("/:branchcode/announcement", updateAnnouncement);
BranchRoutes.get("/announcement", updateAnnouncement);
export default BranchRoutes;
