import express from "express";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  getPaymentMethodsByBranch,
  updatePaymentMethod,
} from "./PaymentMethod.controller.js";

const PaymentMethodRouter = express.Router();

PaymentMethodRouter.post("/create", createPaymentMethod);

PaymentMethodRouter.get("/", getAllPaymentMethods);

PaymentMethodRouter.get("/:id", getPaymentMethodById);

PaymentMethodRouter.put("/:id", updatePaymentMethod);

PaymentMethodRouter.delete("/:id", deletePaymentMethod);

PaymentMethodRouter.get("/branch", getPaymentMethodsByBranch);

export default PaymentMethodRouter;
