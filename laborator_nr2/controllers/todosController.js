import * as Todos from '../model/todoModel.js'

export const getAllTodos = (req, res) => {
    Todos.getAllTodos((err, todos) => {
        if (err) return res.status(500).json({ message: "Ошибка сервера" })
        res.json(todos);
    });
}

export const getTodoByID = (req, res) => {
    const { id } = req.params

    Todos.getTodosById(id, (err, todo) => {
        if (err) return res.status(500).json({ message: "Ошибка сервера" })
        if (!todo) return res.status(404).json({ message: "Задача не найдена" })

        res.json(todo)
    });
};