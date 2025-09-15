import sqlite3 from 'sqlite3'
import dotenv from 'dotenv'
dotenv.config()

const db = new sqlite3.Database(process.env.PATH_DB, (err) => {
  if (err) return console.log(err.message);
  console.log('DB connected');
});

export default db