import * as Category from '../model/categoryModel.js';

export const getAllCategories = (req, res) => {
    Category.getAllCategories((err, rows) => {
        if (err) {
            console.error("Ошибка сервера:", err.message); // логируем
            return res.status(500).json({ message: "Ошибка на сервере" });
        }
        res.json(rows);    
    });
};
