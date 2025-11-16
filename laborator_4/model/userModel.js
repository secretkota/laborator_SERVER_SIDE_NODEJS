import db from "../helpers/db.js"

export const register = (data) => {
    return new Promise((resolve, reject) => {
        const { username, name, password, email } = data
        const stmt = 'INSERT INTO users (username, name, password, email) VALUES (?, ?, ?, ?)'
        db.run(stmt, [username, name, password, email], function(err) {
            if (err) return reject(err)
            resolve({id: this.lastID})
        }) 
    })
}

export const getByLogin = (login) => {
    return new Promise((resolve, reject) => {
        const stmt = 'SELECT * FROM users WHERE username = ?'

        db.get(stmt, [login], (err, user) => {
            if (err) return reject(err)
            resolve(user)
        })
    })
}


export const login = (data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
        const { username } = data
        const stmt = 'SELECT * FROM users WHERE username = ?'
        db.get(stmt, [username], async (err, user) => {
            if (err) return reject(err)
            if (!user) return resolve(null)
            resolve(user)
        })
    })
}

