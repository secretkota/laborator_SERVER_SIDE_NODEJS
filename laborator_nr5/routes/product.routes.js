import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
const r=Router();
r.post("/",ProductController.create);
r.put("/:id",ProductController.update);
export default r;