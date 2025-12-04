import axios from "axios";
import { WebhookModel } from "../models/webhook.model.js";
export class WebhookService{
 static async trigger(event,payload){
  const hooks=WebhookModel.getAll();
  for(const h of hooks){
    try{await axios.post(h.url,{event,data:payload});}
    catch(e){console.error("Webhook failed",h.url);}
  }
 }}
