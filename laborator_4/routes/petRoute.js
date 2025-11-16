import express from 'express'
import * as Pet from '../controllers/petController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { validateData } from '../middleware/validateMiddleware.js'
import { petValidationSchema } from '../validators/petValidator.js'

const router = express.Router()

router.get('/categories',Pet.getCategory)
router.get('/', authMiddleware,Pet.getAll)
router.get('/:id', authMiddleware, Pet.getByID)
router.post('/', authMiddleware, petValidationSchema, validateData,Pet.create)
router.delete('/:id', authMiddleware, validateData,Pet.deletePet)

export default router