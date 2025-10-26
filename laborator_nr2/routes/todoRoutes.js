import express from 'express'
import { getAllTodos, getTodoByID } from '../controllers/todosController.js'


const router = express.Router()

router.get('/todos', getAllTodos)
router.get('/todos/:id', getTodoByID)

export default router