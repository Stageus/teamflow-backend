import { Exception } from "./exception";

export class InternalServerErrorException extends Exception {
    constructor(message: string) {
        super(500, message)
    }
}