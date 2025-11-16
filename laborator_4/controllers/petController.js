import * as Pet from "../model/petModel.js"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import multer from "multer"
import crypto from "crypto"
import asyncWrapper from "../middleware/asyncWrapper.js"
import { AppError } from "../errors/appError.js"
import * as PetError from '../errors/petError.js'
import { NotFoundError } from "../errors/NotFoundError.js"

const upload = multer({ storage: multer.memoryStorage() })
const s3 = new S3Client({
    region: process.env.AWS_REGION,
})



export const getCategory = asyncWrapper(async (req, res) => {
    const categories = await Pet.getCategories()
    if (!categories) throw new NotFoundError("Категории не найдено")
    res.json(categories)

    throw new AppError('Internal server error', 500)
})

export const getAll = asyncWrapper(async (req, res) => {
    const pets = await Pet.getAll(req.user.id)
    if (!pets) throw new NotFoundError("Питомцы не найдено")
    res.json(pets)

    throw new AppError('Internal server error', 500)
})

export const getByID = asyncWrapper(async (req, res) => {
    const petID = req.params.id;

    const pet = await Pet.getByID(petID)
    if (!pet) throw new NotFoundError("Питомец не найдено")
    res.json(pet)

    throw new AppError('Internal server error', 500)
})

export const create = [
    upload.single("image"),
    asyncWrapper(async (req, res) => {
        const { owner_id, name, type, age, desc } = req.body

        if (!name) throw new PetError.InvalidError("Имя животного обязателено")
        if (!type) throw new PetError.InvalidError("Тип животного обязателен")
        if (age < 0) throw new PetError.InvalidError("Возраст не может быть отрицательным")


            let photo_path = null

            if (req.file) {
                const file = req.file
                const key = `pets/${crypto.randomUUID()}.jpeg`

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype
                })

                await s3.send(command);
                photo_path = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
            }

            const pet = await Pet.create({ owner_id, name, type, age, photo_path, desc })

            if (!pet) throw new AppError("Ошибка при создании питомца", 500)


            res.status(201).json({
                message: "Питомец успешно создан",
                petId: pet.id,
                photo_path,
            })

           throw new AppError('Internal server error', 500)
    }),
]

export const deletePet = asyncWrapper((req, res) => {
    const petID = req.params.id;
    const userID = req.user.id;

    deletePet(petID, userID, (err, result) => {
        if (err) throw new AppError('Internal server error', 500)
        if (result.changes === 0) return res.status(404).json({ error: "Питомец не найден" })
        res.json({ success: true })
    })
})
