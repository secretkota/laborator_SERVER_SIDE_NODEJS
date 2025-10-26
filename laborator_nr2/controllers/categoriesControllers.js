import * as Category from '../model/categoryModel.js';

export const getAllCategories = (req, res) => {
    Category.getAllCategories((err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Ошибка на сервере" })
        }
        res.json(rows)
    });
};

export const getCategoryByID = (req, res) => {
    const { id } = req.params
    Category.getCategoryById(id, (err, row) => {
        if (err) return res.status(500).json({ message: "Ошибка на сервере" })
        if (!row) return res.status(404).json({ message: "Категория не найдена!" })
        res.json(row)
    })
}

export const addNewCategory = (req, res) => {
    const { name } = req.body

    if (!name || name.length < 2 || name.length > 100) {
        return res.status(400).json({ message: "Имя категории должно быть от 2 до 100 символов" });
    }

    Category.createNewCategory(name, (err, row) => {
        if (err) return res.status(500).json({ message: "Ошибка на сервере" })
        res.status(201).json(row)
    })
}

export const updateCategory = (req, res) => {
    const { name } = req.body
    const { id } = req.params

    if (!name || name.length < 2 || name.length > 100) {
        return res.status(400).json({ message: "Имя категории должно быть от 2 до 100 символов" })
    }

    Category.getCategoryById(id, (err, row) => {
        if (err) return res.status(500).json({ message: "Ошибка на сервере" })
        if (!row) return res.status(404).json({ message: "Категория не найдена!" })

        Category.updateCategory(id, name, (err, updatedRow) => {
            if (err) return res.status(500).json({ message: "Ошибка на сервере" })
            res.status(200).json(updatedRow)
        })
    })
}

export const deleteCategory = (req, res) => {
    const { id } = req.params

    Category.getCategoryById(id, (err, row) => {
        if (err) return res.status(500).json({ message: "Ошибка на сервере" })
        if (!row) return res.status(404).json({ message: "Категория не найдена!" })

        Category.deleteCategory(id, (err, row) => {
            if (err) return res.status(500).json({ message: "Ошибка на сервере" })
            res.status(204).json(row)
        })
    })
}