import * as Todos from '../model/todoModel.js'
import * as Category from '../model/categoryModel.js';

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
    })
}


export const createNewCategory = (req, res) => {
    const { title, category_id } = req.body

    if (!title || title.length < 2 || title.length > 100) return res.status(400).json({ message: "Название должно быть от 2-х до 100 сиволов" })

    Category.getCategoryById(category_id, (err, row) => {
        if (err) return res.status(500).json({ message: "Ошибка на сервере" })
        if (!row) return res.status(404).json({ message: "Категория не найдена!" })

        Todos.createNewTodo(title, category_id, (err, row) => {
            if (err) return res.status(500).json({ message: "Ошибка сервера" })
            res.status(201).json(row)
        })
    })

}

export const updateTodo = (req, res) => {
    const { id } = req.params
    const { title, completed, category_id } = req.body

    if (!title || title.length < 2 || title.length > 100) return res.status(400).json({ message: "Название должно быть от 2-х до 100 сиволов" })
    if (completed !== 0 && completed !== 1) return res.status(400).json({ message: "Выполнения записывается как 1(true) или 0 (false)" })

    Todos.getTodosById(id, (err, row) => {
        if (err) return res.status(500).json({ message: "Ошибка сервера" })
        if (!row) return res.status(404).json({ message: "задача не найдена!" })

        Category.getCategoryById(category_id, (err, row) => {
            if (err) return res.status(500).json({ message: "Ошибка на сервере" })
            if (!row) return res.status(404).json({ message: "Категория не найдена!" })

            Todos.updateTodo(id, title, completed, category_id, (err, row) => {
                if (err) return res.status(500).json({ message: "Ошибка сервера" })
                res.status(201).json(row)
            })
        })
    })
}

export const toggleTodo = (req, res) => {
    const { id } = req.params

    Todos.getTodosById(id, (err, row) => {
        if (err) return res.status(500).json({ message: "Ошибка сервера" })
        if (!row) return res.status(404).json({ message: "задача не найдена!" })

        Todos.toggleTodo(id, (err, row) => {
            if (err) return res.status(500).json({ message: "Ошибка сервера" })
            res.status(200).json(row)
        })

    })
}

export const deleteTodo = (req, res) => {
    const { id } = req.params

    Todos.getTodosById(id, (err, row) => {
        if (err) return res.status(500).json({ message: "Ошибка сервера" })
        if (!row) return res.status(404).json({ message: "задача не найдена!" })

        Todos.deleteTodo(id, (err, row) => {
            if (err) return res.status(500).json({ message: "Ошибка сервера" })
            res.status(204).json(row)
        })
    })
}