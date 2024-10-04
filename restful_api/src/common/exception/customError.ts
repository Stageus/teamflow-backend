import { NextFunction, Request, Response } from "express";


interface IErrorHandler extends Error {
    status_code: number
}

interface ICustomError {
    errorHandler(err: IErrorHandler, req: Request, res: Response, next: NextFunction): void
    badRequestException(message: string): void
    conflictException(message: string): void
    forbiddenException(message: string): void
    internalServerErrorException(message: string): void
    notFoundException(message: string): void
    unauthorizedException(message: string): void
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
            err.message === "invalid signature" ||
            err.message === "jwt must be provided"
        ) {
            res.status(401).send({
                message: err.message
            })
        }
        
        res.status(err.status_code || 500).send({
            message: err.message
        })
    }

    badRequestException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => next(this.createError(message, 400))
    }

    conflictException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => next(this.createError(message, 409))
    }

    forbiddenException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => next(this.createError(message, 403))
    }

    internalServerErrorException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => next(this.createError(message, 500))
    }

    notFoundException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => next(this.createError(message, 404))
    }

    unauthorizedException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => next(this.createError(message, 401))
    }
}