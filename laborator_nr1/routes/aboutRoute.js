import { Router } from "express";
import { aboutText } from "../controllers/aboutControllers.js";

const router = Router()

router.get('/', aboutText)

export default router