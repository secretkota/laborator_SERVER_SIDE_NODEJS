import db from "./connectDB.js"

export const createTable = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            completed BOOLEAN
        )`)    
    })
}