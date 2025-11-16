import { AppError } from "./appError.js"


export class ConnectError extends AppError {
    constructor(message = 'Failed connect to database') {
        super(message, 503)
    }
}