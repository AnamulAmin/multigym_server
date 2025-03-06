import { Router } from "express";
import {
  createPackage,
  getAllPackage,
  getAllPackages,
  getByIdPackage,
  removePackage,
  updatePackage,
  getPackageNamesByBranch,  // Import the new function
} from "./Package.controller.js";

const PackagesRoutes = Router();

PackagesRoutes.get("/", getAllPackages);
PackagesRoutes.get("/:branch/get-all", getAllPackage);

PackagesRoutes.get("/get-id/:id", getByIdPackage);

PackagesRoutes.post("/post", createPackage);

PackagesRoutes.delete("/delete/:id", removePackage);

PackagesRoutes.put("/put/:id", updatePackage);

PackagesRoutes.get("/:branch/names", getPackageNamesByBranch);  // Add the new route

export default PackagesRoutes;
