import express from 'express'
import dotenv from 'dotenv'
import expressLayouts from 'express-ejs-layouts';
import todoRoute from './routes/todoRoute.js'
import aboutRoute from './routes/aboutRoute.js'
import { createTable } from './utils/createTable.js'
import { pageNotFound } from './controllers/errorController.js';

dotenv.config()

const app = express()
const port = process.env.PORT
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(expressLayouts)
app.set('layout', 'layout')
// create TABLE TODOS IN DB
createTable()

app.use('/todos', todoRoute)
app.use('/about', aboutRoute)

app.use(pageNotFound)

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})