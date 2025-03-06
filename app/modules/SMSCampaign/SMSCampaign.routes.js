import { Router } from "express";
import {
  createSMSCampaign,
  getSMSCampaignById,
  deleteSMSCampaign,
  getSMSCampaignsByBranch,
} from "./SMSCampaign.controller.js";

const SMSCampaignRoutes = Router();

SMSCampaignRoutes.post("/post", createSMSCampaign);
SMSCampaignRoutes.get("/:id", getSMSCampaignById);
SMSCampaignRoutes.delete("/:id", deleteSMSCampaign);

// Adjusted route to accept pagination parameters as query
SMSCampaignRoutes.get("/branch/:branch", getSMSCampaignsByBranch);

export default SMSCampaignRoutes;
