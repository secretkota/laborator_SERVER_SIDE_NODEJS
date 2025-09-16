import db from "../utils/connectDB.js"

export const getTasks = (req, res) => {
    const { status } = req.query
    let stmt = 'SELECT * FROM todos'
    let todosList = []

    if (status === 'active') {
        stmt += ' WHERE completed = ?'
        todosList.push(0)
    } else if (status === 'completed') {
        stmt += ' WHERE completed = ?'
        todosList.push(1)
    }

    db.all(stmt, todosList, (err, rows) => {
        if (err) return res.render('404Page', {codeError: '500 server error'})
        
        res.render('todos', {todos: rows, status: status || 'all'})
    })

}

export const createTask = (req, res) => {
    const { title, completed } = req.body

    if (!title.trim() || completed === undefined) return res.render('404Page', {
        codeError: '400 Invalid data'
    })

    const stmt = db.prepare(`INSERT INTO todos(title, completed) VALUES (?, ?)`)
    stmt.run([title, completed === 'true' ? 1 : 0], (err) => {
        if (err) return res.render('404Page', {codeError: '500 server error'})
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

export const deleteTask = (req, res) => {
    const { id } = req.params

    db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
        if (err) {
            return res.render('404Page', {codeError: '404 user not found'})
        }
        return res.redirect('/todos')
    })
}
