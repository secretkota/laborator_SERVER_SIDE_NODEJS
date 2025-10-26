import sqlite3 from 'sqlite3'



const db = new sqlite3.Database('./data/todoDB.db', (err) => {
    if (err) console.log('Error with DB!', err.message)
    console.log('database was started!')
})

export default db