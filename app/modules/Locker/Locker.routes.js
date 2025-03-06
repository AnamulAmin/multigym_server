import { Router } from "express";
import {
  createLocker,
  getAllLockers,
  getByIdLocker,
  getlockerssByFilter,
  removeLocker,
  updateLocker,
  updateLockerMemberAndStatus,
  unassignLocker,
  assignLockerToUser,
  unassignLockerFromUser,
} from "./Locker.controller.js";

const LockerRoutes = Router();

LockerRoutes.get("/:branch/get-all", getAllLockers);
LockerRoutes.get("/:branch/:group/:gender/:status", getlockerssByFilter);
LockerRoutes.get("/:id", getByIdLocker);
LockerRoutes.post("/post", createLocker);
LockerRoutes.delete("/:id", removeLocker);
LockerRoutes.put("/put/:id", updateLocker);
LockerRoutes.put('/update/:locker_id', updateLockerMemberAndStatus);
LockerRoutes.put('/unassign/:locker_id', unassignLocker); 
LockerRoutes.put('/assign-locker/:locker_id', assignLockerToUser);
LockerRoutes.put('/unassign-locker/:locker_id', unassignLockerFromUser);



export default LockerRoutes;
