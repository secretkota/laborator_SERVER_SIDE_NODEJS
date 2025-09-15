import db from "../utils/connectDB.js"

export const getTasks = (req, res) => {

    db.all('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).json({ error: "Database error"})
        res.render('todos', { todos })
    })
}

export const createTask = (req, res) => {
    const { title, completed } = req.body
    const stmt = db.prepare(`INSERT INTO todos(title, completed) VALUES (?, ?)`)
    stmt.run([title, completed === 'true' ? 1 : 0], (err) => {
        if (err) return res.status(500).send('database error')
        return res.redirect('/todos')
    })

}




export const updateTask = (req, res) => {
    const { id } = req.params;
    db.get('SELECT completed FROM todos WHERE id = ?', [id], (err, row) => {

        if (err) {
            console.error(err.message)
            return res.status(500).render('404Page')
        }

        if (!row) {
            return res.status(404).render('404Page')
        }

        const newCompleted = row.completed ? 0 : 1

        db.run('UPDATE todos SET completed = ? WHERE id = ?', [newCompleted, id], function(err) {
            if (err) {
                console.error(err.message)
                return res.status(500).render('404Page')
            }
            return res.redirect('/todos')
        })
    })
}

export const deleteTask = (req, res, next) => {
    const { id } = req.params;

    db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
        if (err) {
            return next(err);
        }
        return res.redirect('/todos');
    });
};
