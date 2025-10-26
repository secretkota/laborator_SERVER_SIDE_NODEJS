import db from "../config/db.js"

export const getAllCategories = (callback) => {
    db.all('SELECT * FROM categories', callback)
}

export const getCategoryById = (callback) => {
    db.get('')
}