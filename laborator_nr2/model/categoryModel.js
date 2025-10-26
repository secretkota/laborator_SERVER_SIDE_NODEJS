import db from "../config/db.js"

export const getAllCategories = (callback) => {
    db.all('SELECT * FROM categories', callback)
}

export const getCategoryById = (id, callback) => {
    db.get('SELECT * FROM categories WHERE id = ?', [id], callback)
}

export function createNewCategory(name, callback) {
    db.run('INSERT INTO categories (name) VALUES (?)', [name], callback(null, { id: this.lastID, name }))
}

export function updateCategory(id, name, callback) {
    db.run(`
        UPDATE categories
        SET name = ?
        WHERE id = ?
        `, [name, id], callback(null, { id, name, changes: this.changes }))
}

export function deleteCategory(id, callback) {
    db.run('DELETE FROM categories WHERE id = ?', [id], callback(null, {id, deleted : this.changes}))
}