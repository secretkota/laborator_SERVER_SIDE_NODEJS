import { body } from "express-validator";

export const userValidationSchema = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 20 })
        .withMessage("username need be at 3 characters max 20"),

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 20 })
        .withMessage("name need be at 3 characters max 20"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number"),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail()

]