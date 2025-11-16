import { AppError } from "./appError.js"

export class ConflictError extends AppError {
    constructor(message = "User was registred") {
        super(message, 409)
    }
}

export class InvalidError extends AppError {
    constructor(message = "Unauthorized", statuCode = 401) {
        super(message, statuCode)
    }
}