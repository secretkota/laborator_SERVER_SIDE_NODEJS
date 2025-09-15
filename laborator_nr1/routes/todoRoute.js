import { Router } from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/todoControllers.js";
import { aboutText } from "../controllers/aboutControllers.js";

const router = Router()

router.get('/', getTasks)

router.get('/new', (req, res) => {
    res.render('newTodo')
})

router.post('/new', createTask)

router.post('/:id/toggle', updateTask)

router.post('/:id/delete', deleteTask)

export default router