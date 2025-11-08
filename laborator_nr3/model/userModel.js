import db from "../helpers/db.js"

export const register = (data) => {
    return new Promise((resolve, reject) => {
        const { name, password, email } = data
        const stmt = 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)'
        db.run(stmt, [name, password, email], function(err) {
            if (err) return reject(err)
            resolve({id: this.lastID})
        }) 
    })
}

export const getByLogin = (login) => {
    return new Promise((resolve, reject) => {
        const stmt = 'SELECT * FROM users WHERE name = ?'

        db.get(stmt, [login], (err, user) => {
            if (err) return reject(err)
            resolve(user)
        })
    })
}


export const login = (data) => {
    return new Promise((resolve, reject) => {
        const { name} = data
        const stmt = 'SELECT * FROM users WHERE name = ?'
        db.get(stmt, [name], async (err, user) => {
            if (err) return reject(err)
            if (!user) return resolve(null)
            resolve(user)
        })
    })
}

