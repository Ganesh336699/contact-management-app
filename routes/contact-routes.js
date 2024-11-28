import express from "express";
import { AddContact, deleteContact, getContacts, updateContact } from "../controllers/contact-controller.js";

const ContactRouter = express.Router();



ContactRouter.post("/add" , AddContact);
ContactRouter.get("/:id" ,getContacts);
ContactRouter.put("/:id" , updateContact);
ContactRouter.delete("/:id",deleteContact);