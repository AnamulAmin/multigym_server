import express from "express";
import {
  createTransactionType,
  deleteTransactionType,
  getAllTransactionTypes,
  getTransactionTypeById,
  getTransactionTypesByBranch,
  updateTransactionType,
} from "./AddTransactionType.controller.js";

const TransactionTypeRouter = express.Router();

TransactionTypeRouter.post("/create", createTransactionType);

TransactionTypeRouter.get("/", getAllTransactionTypes);

TransactionTypeRouter.get("/:id", getTransactionTypeById);

TransactionTypeRouter.put("/:id", updateTransactionType);

TransactionTypeRouter.delete("/:id", deleteTransactionType);

TransactionTypeRouter.get("/branch", getTransactionTypesByBranch);

export default TransactionTypeRouter;
