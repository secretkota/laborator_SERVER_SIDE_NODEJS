import express from 'express'
import { addNewCategory, deleteCategory, getAllCategories, getCategoryByID, updateCategory } from '../controllers/categoriesControllers.js'

const router = express.Router()

router.get('/categories', getAllCategories)
router.post('/categories', addNewCategory)

router.get('/categories/:id', getCategoryByID)
router.put('/categories/:id', updateCategory)
router.delete('/categories/:id', deleteCategory)

export default router