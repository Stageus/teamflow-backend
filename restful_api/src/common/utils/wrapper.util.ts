import { NextFunction, Request, RequestHandler, Response } from "express";

export function wrapper(requestHandler: RequestHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}