import express from 'express'
import { getAllCategories } from '../controllers/categoriesControllers.js'

const router = express.Router()

router.get('/categories', getAllCategories)



export default router