import { Router } from "express";
import {
  createInvoice,
  getAllInvoice,
  getAllInvoiceByFilter,
  getAllInvoices,
  getByIdInvoice,
  getInvoiceByFilter,
  getMonthlySalesReport,
  removeInvoice,
  updateInvoice,
} from "./Invoice.controller.js";

const InvoicesRoutes = Router();

InvoicesRoutes.get("/get-all", getAllInvoices);
InvoicesRoutes.get("/get-sales-report", getMonthlySalesReport);
InvoicesRoutes.get("/", getAllInvoice);
InvoicesRoutes.get("/get-filter-invoice", getAllInvoiceByFilter);
InvoicesRoutes.get("/:id", getInvoiceByFilter);

InvoicesRoutes.get("/get-id/:id", getByIdInvoice);

InvoicesRoutes.post("/post", createInvoice);

InvoicesRoutes.delete("/delete/:id", removeInvoice);

InvoicesRoutes.put("/put/:id", updateInvoice);

export default InvoicesRoutes;