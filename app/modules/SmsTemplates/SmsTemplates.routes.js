import { Router } from "express";
import {
  createSmsTemplate,
  getAllSmsTemplates,
  getSmsTemplateById,
  updateSmsTemplate,
  deleteSmsTemplate,
} from "./SmsTemplates.controller.js";

const SmsTemplatesRoutes = Router();

SmsTemplatesRoutes.get("/", getAllSmsTemplates);
SmsTemplatesRoutes.get("/:id", getSmsTemplateById);
SmsTemplatesRoutes.post("/", createSmsTemplate);
SmsTemplatesRoutes.put("/:id", updateSmsTemplate);
SmsTemplatesRoutes.delete("/:id", deleteSmsTemplate);

export default SmsTemplatesRoutes;
