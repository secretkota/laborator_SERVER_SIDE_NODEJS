import sqlite3 from 'sqlite3'
import * as DataBase from '../errors/DataBaseError.js'

const db = new sqlite3.Database('./model/petBD.db', (err) => {
    if (err) throw new DataBase.ConnectError('Failed connect to database')
    
    console.log('Database was started')
})

export default db