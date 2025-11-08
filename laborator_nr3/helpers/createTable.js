import db from "./db.js"

const createTables = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL
            )`);

        db.run(`
            CREATE TABLE IF NOT EXISTS type_pet(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
            )`);

        db.run(`
            CREATE TABLE IF NOT EXISTS pet (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_id INTEGER,
            name TEXT NOT NULL,
            type INTEGER,
            age TEXT NOT NULL DEFAULT '',
            photo_path TEXT NOT NULL DEFAULT '',
            desc VARCHAR(300) NOT NULL DEFAULT '',
            FOREIGN KEY (owner_id) REFERENCES users(id),
            FOREIGN KEY (type) REFERENCES type_pet(id)
        )`);
    })
}

export default createTables