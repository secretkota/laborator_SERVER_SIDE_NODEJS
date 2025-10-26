import express from 'express'
import env from 'dotenv'
import categoriesRoute from './routes/categoriesRoutes.js'

env.config()

const port = 3000
const app = express()

app.use('/api', categoriesRoute)

app.use((req, res) => {
    res.status(404).json({
        message: "endpoint not found"
    })
})

app.listen(port, () => {
    console.log(`server was started http://localhost:${port}`)
})
