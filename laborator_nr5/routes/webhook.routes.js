import { Router } from "express";
import { WebhookController } from "../controllers/webhook.controller.js";
const r=Router();
r.post("/register",WebhookController.register);
export default r;