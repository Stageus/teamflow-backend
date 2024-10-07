import { NextFunction, Request, Response } from "express";

interface IResponseFilter{
    response200 (message: object): (req: Request, res: Response, next: NextFunction) => void
    response203 (message: object): (req: Request, res: Response, next: NextFunction) => void
}

export class ResponseFilter implements IResponseFilter {
    response200 (data?: object): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => {
            res.status(200).send(data)
        }
    }
    
    response203 (data?: object): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => {
            res.status(203).send(data)
        }
    }
}