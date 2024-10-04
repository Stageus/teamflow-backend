import { NextFunction, Request, Response } from "express";

export interface ErrorHandler extends Error {
    status_code: number
}

export function errorHandler(err: ErrorHandler, req: Request, res: Response, next: NextFunction) {
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