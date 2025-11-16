import { body } from "express-validator";

export const petValidationSchema = [
    body("name")
        .trim()
        .notEmpty().withMessage("Поле name обязательно")
        .isLength({ min: 2, max: 50 }).withMessage("name должно быть от 2 до 50 символов"),

    body("type")
        .trim()
        .notEmpty().withMessage("Поле type обязательно"),

    body("age")
        .notEmpty().withMessage("Поле age обязательно")
        .isInt({ min: 0, max: 50 }).withMessage("age должен быть целым числом от 0 до 50"),

    body("desc")
        .trim()
        .isLength({ max: 200 }).withMessage("desc может содержать максимум 200 символов")
]
