import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "./errorHandler";

export function badRequestException(message: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        const error = new Error(message) as ErrorHandler
        error.status_code = 400
        next(error)
    }
}