import { db } from "../db.js";
export class WebhookModel{
 static register(url){const e={id:Date.now().toString(),url};db.webhooks.push(e);return e;}
 static getAll(){return db.webhooks;}
}