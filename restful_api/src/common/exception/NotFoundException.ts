import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "./errorHandler";

export function notFoundException(message: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        const error = new Error(message) as ErrorHandler
        error.status_code = 404
        next(error)
    }
}