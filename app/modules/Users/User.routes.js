import { Router } from "express";
import {
  createUser,
  getAllStaffs,
  getAllUser,
  getAllUserByFilter,
  getAllUsers,
  getUsersForTax,
  updateTaxForUsers,
  getByIdUser,
  removeUser,
  updateUser,
  getByEmailUser,
  loginUser,
  getStats,
  createJsonUser, //Temp purpose for data added
  getUsersByStatusAndRole,
  getAllUserBySearch,
  getUpcomingBirthday,
  getAllBySearch,
  getInactiveUsersBySearch,
  requestOTP,
  getUserWithFollowUp,
  verifyOTP,
  createStaff,
  automatedreminders,
  signedUpUser,
  registrationUser,
  createUserByFirebase,
  updateUsercode,
  checkMobileNumberAndEmail
} from "./User.controller.js";

const usersRoutes = Router();
usersRoutes.get("/", getAllUsers);
usersRoutes.get("/get-stats/:branch", getStats);
usersRoutes.get("/get-all", getAllUser);
usersRoutes.get("/get-users-search", getAllUserBySearch);
usersRoutes.get("/get-all-search", getAllBySearch);
usersRoutes.post("/get-users", getAllUserByFilter);
usersRoutes.get("/get-staffs", getAllStaffs);

usersRoutes.get("/get-id/:id", getByIdUser);
usersRoutes.get("/user_by_email/:email", getByEmailUser);
usersRoutes.get("/inactive-users-search", getInactiveUsersBySearch);

// This will create user only in db not in firebase
usersRoutes.post("/post", createUser);
usersRoutes.post("/registration", registrationUser);
usersRoutes.post("/staff",createStaff);
usersRoutes.post("/checkMobileNumberAndEmail",checkMobileNumberAndEmail);
usersRoutes.post("/signup", signedUpUser);
usersRoutes.post("/json", createJsonUser);
usersRoutes.post("/get-users", getAllUserByFilter);
usersRoutes.post("/login", loginUser);
usersRoutes.post("/request-otp", requestOTP);
usersRoutes.post("/verify-otp", verifyOTP);

usersRoutes.post("/createFirebaseUser",createUserByFirebase)

usersRoutes.delete("/delete/:id", removeUser);
usersRoutes.get("/upcoming-birthday", getUpcomingBirthday);


usersRoutes.get("/status/:status/role/:role", getUsersByStatusAndRole); //http://localhost:8000/api/users/status/active/role/member for sms only
usersRoutes.get("/users-with-followups/:branch", getUserWithFollowUp);

usersRoutes.get("/tax", getUsersForTax);
usersRoutes.put("/tax", updateTaxForUsers);
usersRoutes.put("/put/:id", updateUser);
usersRoutes.put("/update/:id", updateUsercode);

usersRoutes.get("/automatedreminders", automatedreminders);
export default usersRoutes;
