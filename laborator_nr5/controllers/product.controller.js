import { ProductModel } from "../models/product.model.js";
import { WebhookService } from "../services/webhook.service.js";
export class ProductController{
 static async create(req,res){
  const {name,price}=req.body;
  if(!name||!price)return res.status(400).json({message:"name and price required"});
  const p=ProductModel.create({name,price});
  await WebhookService.trigger("product.created",p);
  res.json({message:"Product created",product:p});
 }
 static async update(req,res){
  const {id}=req.params;
  const p=ProductModel.update(id,req.body);
  if(!p)return res.status(404).json({message:"Not found"});
  await WebhookService.trigger("product.updated",p);
  res.json({message:"Product updated",product:p});
 }}