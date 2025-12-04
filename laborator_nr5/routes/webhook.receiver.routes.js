import { Router } from "express";
const router=Router();
let events=[];
router.post("/",(req,res)=>{events.push(req.body);res.json({ok:true});});
router.get("/",(req,res)=>res.json(events));
export default router;