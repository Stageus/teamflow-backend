import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "./errorHandler";

export function unauthorizedException(message: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        const error = new Error(message) as ErrorHandler
        error.status_code = 401
        next(error)
    }
}