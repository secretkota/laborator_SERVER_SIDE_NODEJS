import db from "../helpers/db.js"



export const getCategories = (req, res) => {
    return new Promise ((resolve, reject) => {
        db.all("SELECT * FROM type_pet", (err, rows) => {
            if (err) return reject(err)
            resolve(rows)
        } )
    })
}

export const getAll= (userID) => {
    return new Promise ((resolve, reject) => {
        db.all("SELECT * FROM pet WHERE owner_id = ?", [userID], (err, row) => {
            if (err) return reject(err)
            resolve(row)
        })
    })
}

export const getByID = (id) => {
    return new Promise ((resolve, reject) => {
        db.get("SELECT * FROM pet WHERE id = ?", [id], (err, row) => {
            if (err) return reject(err)
            resolve(row)
        })
    })
}


export const create = (data) => {
    return new Promise ((resolve, reject) => {
        const { owner_id, name, type, age, photo_path, desc} = data
        console.log(data)
        const stmt = "INSERT INTO pet (owner_id, name, type, age, photo_path, desc) VALUES (?, ?, ?, ?, ?, ?)"

        db.run(stmt,  [owner_id, name, type, age, photo_path, desc], function (err) {
            if (err) return reject(err)
            resolve({id: this.lastID})
        })
    })
}



export const deletePet = (petID, userID, callback) => {
    const sql = "DELETE FROM pet WHERE id = ? AND owner_id = ?";

    db.run(sql, [petID, userID], function(err) {
        if (err) return callback(err);
        callback(null, { changes: this.changes });
    });
};