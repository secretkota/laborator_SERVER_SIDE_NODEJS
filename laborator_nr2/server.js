import express from 'express'
import env from 'dotenv'
import categoriesRoute from './routes/categoriesRoutes.js'
import todosRoute  from './routes/todoRoutes.js'
env.config()

const port = 3000
const app = express()

app.use(express.json())

app.use('/api', categoriesRoute)
app.use('/api', todosRoute)

app.use((req, res) => {
    res.status(404).json({
        message: "endpoint not found"
    })
})

app.listen(port, () => {
    console.log(`server was started http://localhost:${port}`)
})
