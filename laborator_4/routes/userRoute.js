import express from 'express'
import * as User from '../controllers/userController.js'
import asyncWrapper from '../middleware/asyncWrapper.js'
import { validateData } from '../middleware/validateMiddleware.js'
import { userValidationSchema } from '../validators/userValidator.js'

const router = express.Router()

router.post('/register', userValidationSchema, validateData,asyncWrapper(User.Register))
router.post('/login', userValidationSchema, validateData,asyncWrapper(User.Login))


export default router