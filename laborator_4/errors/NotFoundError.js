import { AppError } from "./appError.js"


export class NotFoundError extends AppError {
    constructor(message = "Resourse not found") {
        super(message, 404)
    }
}