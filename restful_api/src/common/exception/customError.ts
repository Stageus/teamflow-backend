import { NextFunction, Request, Response } from "express";


interface IErrorHandler extends Error {
    status_code: number
}

interface ICustomError {
    errorHandler(err: IErrorHandler, req: Request, res: Response, next: NextFunction): void
    badRequestException(message: string): Function
    conflictException(message: string): Function
    forbiddenException(message: string): Function
    internalServerErrorException(message: string): Function
    notFoundException(message: string): Function
    unauthorizedException(message: string): Function
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

    badRequestException(message: string): Function {
        return function (req: Request, res: Response, next: NextFunction) {
            const error = new Error(message) as IErrorHandler
            error.status_code = 400
            next(error)
        }
    }

    conflictException(message: string): Function {
        return function (req: Request, res: Response, next: NextFunction) {
            const error = new Error(message) as IErrorHandler
            error.status_code = 409
            next(error)
        }
    }

    forbiddenException(message: string): Function {
        return function (req: Request, res: Response, next: NextFunction) {
            const error = new Error(message) as IErrorHandler
            error.status_code = 403
            next(error)
        }
    }

    internalServerErrorException(message: string): Function {
        return function (req: Request, res: Response, next: NextFunction) {
            const error = new Error(message) as IErrorHandler
            error.status_code = 500
            next(error)
        }
    }

    notFoundException(message: string): Function {
        return function (req: Request, res: Response, next: NextFunction) {
            const error = new Error(message) as IErrorHandler
            error.status_code = 404
            next(error)
        }
    }

    unauthorizedException(message: string): Function {
        return function (req: Request, res: Response, next: NextFunction) {
            const error = new Error(message) as IErrorHandler
            error.status_code = 401
            next(error)
        }
    }
}