import db from "../config/db.js"

export const getAllTodos = (callback) => {
    db.all(`
        SELECT
            todos.id AS todos_id,
            todos.title,
            todos.completed,
            todos.due_date,
            todos.created_at,
            todos.updated_at,
            categories.id AS category_id,
            categories.name AS category_name
        FROM todos
        LEFT JOIN categories ON todos.category_id = categories.id
        `, (err, rows) => {
        if (err) return callback(err)

        const todos = rows.map(row => ({
            id: row.todos_id,
            title: row.title,
            completed: !!row.completed,
            due_date: row.due_date,
            created_at: row.created_at,
            updated_at: row.updated_at,
            category: row.category_id ? { id: row.category_id, name: row.category_name } : null
        }))

        callback(null, todos)
    })
}


export const getTodosById = (id, callback) => {
    db.get(`
        SELECT
            todos.id AS todos_id,
            todos.title,
            todos.completed,
            todos.due_date,
            todos.created_at,
            todos.updated_at,
            categories.id AS category_id,
            categories.name AS category_name
        FROM todos
        LEFT JOIN categories ON todos.category_id = categories.id
        WHERE todos_id = ?
        `, [id], (err, row) => {
        if (err) return callback(err)
        if (!row) return callback(null, null)

        const todo = {
            id: row.todos_id,
            title: row.title,
            completed: !!row.completed,
            due_date: row.due_date,
            created_at: row.created_at,
            updated_at: row.updated_at,
            category: row.category_id ? { id: row.category_id, name: row.category_name } : null
        }

        callback(null, todo)
    })
}

export function createNewTodo(title, category_id, callback) {
    db.run('INSERT INTO todos (title, category_id) VALUES (?, ?)',
        [title, category_id],
        callback(null, { id: this.lastID, title, category_id })
    )
}

export function updateTodo(id, title, completed, category_id, callback) {
    db.run(`
        UPDATE todos
        SET title = ?, completed = ?, category_id = ?
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [title, completed, category_id, id],
        callback(null, { id, title, completed, category_id, changes: this.changes })
    )
}

export function toggleTodo (id, callback) {
    db.run(`
        UPDATE todos
        SET completed = CASE
            WHEN completed = 1 THEN 0
            ELSE 1
        END,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `, [id], callback(null, {id, changes: this.changes}))
}

export function deleteTodo(id, callback) {
    db.run(`
        DELETE FROM todos
        WHERE id = ?
        `, [id], callback(null, {id, deleted: this.deleted}))
}