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
        return (req, res, next) => {
            const error = new Error(message) as IErrorHandler
            error.status_code = 400
            next(error)
        }
    }

    conflictException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => {
            const error = new Error(message) as IErrorHandler
            error.status_code = 409
            next(error)
        }
    }

    forbiddenException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => {
            const error = new Error(message) as IErrorHandler
            error.status_code = 403
            next(error)
        }
    }

    internalServerErrorException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => {
            const error = new Error(message) as IErrorHandler
            error.status_code = 500
            next(error)
        }
    }

    notFoundException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => {
            const error = new Error(message) as IErrorHandler
            error.status_code = 404
            next(error)
        }
    }

    unauthorizedException(message: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => {
            const error = new Error(message) as IErrorHandler
            error.status_code = 401
            next(error)
        }
    }
}