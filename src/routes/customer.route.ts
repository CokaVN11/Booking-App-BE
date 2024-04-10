import { CustomerController } from "@controllers/customer.controller";
import { Router } from "express";

export const customerRoute = Router();

customerRoute.post("/booking", CustomerController.getInstance().addBooking);