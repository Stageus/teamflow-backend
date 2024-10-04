import { Exception } from "./exception";

export class BadRequestException extends Exception {
    constructor(message: string) {
        super(400, message)
    }
}