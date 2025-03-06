import { Router } from "express";
import {
  createGymMachine,
  getAllGymMachines,
  getGymMachineById,
  removeGymMachine,
  updateGymMachine,
  getGymMachinesByBranch,
} from "./GymMachines.controller.js";

const GymMachinesRoutes = Router();

GymMachinesRoutes.get("/", getAllGymMachines);
GymMachinesRoutes.get("/:branch/get-all", getGymMachinesByBranch);

GymMachinesRoutes.get("/get-id/:id", getGymMachineById);

GymMachinesRoutes.post("/post", createGymMachine);

GymMachinesRoutes.delete("/delete/:id", removeGymMachine);

GymMachinesRoutes.put("/put/:id", updateGymMachine);

export default GymMachinesRoutes;
