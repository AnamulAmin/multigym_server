import { Router } from "express";
import {
  createSMSLog,
  getSMSLogById,
  deleteSMSLog,
  getSMSLogsByBranch,
  getLast7SMSLogs,
} from "./SMSLog.controller.js";

const SMSLogRoutes = Router();

SMSLogRoutes.post("/post", createSMSLog);
SMSLogRoutes.get("/:id", getSMSLogById);
SMSLogRoutes.delete("/:id", deleteSMSLog);

// Adjusted route to accept pagination parameters as query
SMSLogRoutes.get("/branch/:branch", getSMSLogsByBranch);
SMSLogRoutes.get("/last7/:mobile", getLast7SMSLogs);


export default SMSLogRoutes;
