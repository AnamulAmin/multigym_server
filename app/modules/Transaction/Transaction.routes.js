import { Router } from "express";
import {
  createTransaction,
  getAllExpense,
  getAllTransaction,
  getAllTransactions,
  removeTransaction,
} from "./Transaction.controller.js";
import { removeInvoice } from "../Invoice/Invoice.controller.js";

const TransactionRoutes = Router();

TransactionRoutes.get("/get-all", getAllTransactions);
TransactionRoutes.get("/", getAllTransaction);
TransactionRoutes.get("/expense", getAllExpense);
TransactionRoutes.post("/post", createTransaction);
TransactionRoutes.delete("/delete/:id", removeTransaction, removeInvoice);

export default TransactionRoutes;
