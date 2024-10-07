import { NextFunction, Request, Response } from "express";


interface IErrorHandler extends Error {
    status_code: number
}

interface ICustomError {
    errorHandler(err: IErrorHandler, req: Request, res: Response, next: NextFunction): void
    badRequestException(message: string): IErrorHandler
    conflictException(message: string): IErrorHandler
    forbiddenException(message: string): IErrorHandler
    internalServerErrorException(message: string): IErrorHandler
    notFoundException(message: string): IErrorHandler
    unauthorizedException(message: string): IErrorHandler
}

export class CustomError implements ICustomError {
    private createError(message: string, status_code: number): IErrorHandler {
        const error = new Error(message) as IErrorHandler
        error.status_code = status_code
        return error
    }
    
    errorHandler(err: IErrorHandler, req: Request, res: Response, next: NextFunction): void {
        if (
            err.message === "jwt expired" ||
            err.message === "invalid token" ||
            err.message === "jwt must be provided" ||
            err.message === "invalid signature"
        ) {
            res.status(401).send({
                message: err.message
            })
        } else {
            res.status(err.status_code || 500).send({
                message: err.message
            })
        }
    }

    badRequestException(message: string): IErrorHandler {
        return this.createError(message, 400)
    }

    conflictException(message: string): IErrorHandler {
        return this.createError(message, 409)
    }

    forbiddenException(message: string): IErrorHandler {
        return this.createError(message, 403)
    }

    internalServerErrorException(message: string): IErrorHandler {
        return this.createError(message, 500)
    }

    notFoundException(message: string): IErrorHandler {
        return this.createError(message, 404)
    }

    unauthorizedException(message: string): IErrorHandler {
        return this.createError(message, 401)
    }
}