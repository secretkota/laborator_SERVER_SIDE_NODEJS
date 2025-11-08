import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./model/petBD.db', (err) => {
    if (err) return console.log('Error with DB', err.message)
    console.log('Database was created')
})

export default db