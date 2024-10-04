import { Exception } from "./exception";

export class NotFoundException extends Exception {
    constructor(message: string) {
        super(404, message)
    }
}