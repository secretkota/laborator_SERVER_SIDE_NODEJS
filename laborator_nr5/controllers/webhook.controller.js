import { WebhookModel } from "../models/webhook.model.js";
export class WebhookController{
 static register(req,res){
  const {url}=req.body;
  if(!url)return res.status(400).json({message:"URL required"});
  const r=WebhookModel.register(url);
  res.json({message:"Webhook registered",webhook:r});
 }}