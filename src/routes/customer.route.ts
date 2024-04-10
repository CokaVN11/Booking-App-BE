import { CustomerController } from "@controllers/customer.controller";
import { Router } from "express";

export const customerRoute = Router();

customerRoute.get("/", (_req, res) => {
  res.send("Customer route");
});

customerRoute.post("/booking", CustomerController.getInstance().addBooking);