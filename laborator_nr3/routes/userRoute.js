import express from 'express'
import * as User from '../controllers/userController.js'

const router = express.Router()

router.post('/register', User.Register)
router.post('/login', User.Login)


export default router