import express from 'express'
import 'dotenv/config'
import createTables from './helpers/createTable.js'
import petRoute from './routes/petRoute.js'
import userRouter from './routes/userRoute.js'
import { NotFoundError } from './errors/NotFoundError.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'

const app = express()
app.use(express.json())

createTables()

app.use(requestLogger)

app.use('/pet', petRoute)
app.use('/user', userRouter)


app.use((req, res) => {
    throw new NotFoundError('Endpoint not found')
})

app.use(errorHandler)

app.listen(8000, (req, res) => {
    console.log('Server was started! http://localhost:8000')
})