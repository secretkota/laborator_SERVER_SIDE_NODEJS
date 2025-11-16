import { AppError } from "./appError.js"

export class InvalidError extends AppError {
    constructor(message = "Invalid data", statuCode = 40) {
        super(message, statuCode)
    }
}