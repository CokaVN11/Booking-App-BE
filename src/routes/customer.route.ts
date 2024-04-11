import * as Controller from "@controllers";
import { Router } from "express";

export const customerRoute = Router();

customerRoute.post("/booking", Controller.BookingController.getInstance().addBooking);
