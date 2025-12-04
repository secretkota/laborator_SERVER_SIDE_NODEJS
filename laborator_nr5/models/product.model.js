import { db } from "../db.js";
export class ProductModel {
  static create(data){const p={id:Date.now().toString(),...data};db.products.push(p);return p;}
  static update(id,data){const p=db.products.find(x=>x.id===id);if(!p)return null;Object.assign(p,data);return p;}
}