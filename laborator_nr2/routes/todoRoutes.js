import express from 'express'
import { createNewCategory, deleteTodo, getAllTodos, getTodoByID, toggleTodo, updateTodo } from '../controllers/todosController.js'


const router = express.Router()

router.get('/todos', getAllTodos)
router.post('/todos', createNewCategory)

router.get('/todos/:id', getTodoByID)
router.put('/todos/:id', updateTodo)
router.delete('/todos/:id', deleteTodo)
router.patch('/todos/:id/toggle', toggleTodo)
export default router