import express from 'express'
import * as Pet from '../controllers/petController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/categories', Pet.getCategory)
router.get('/', authMiddleware, Pet.getAll)
router.get('/:id', authMiddleware, Pet.getByID)
router.post('/', authMiddleware, Pet.create)
router.delete('/:id', authMiddleware, Pet.deletePet)

export default router