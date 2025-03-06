import { Router } from "express";
import {sendPackageEmail } from "./Email.controller.js";

const emailRoutes = Router();

emailRoutes.post("/sendPackageDetails",sendPackageEmail);

export default emailRoutes ;

