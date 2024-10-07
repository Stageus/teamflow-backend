import { NextFunction, Request, Response } from "express";
import { CustomError } from "../exception/customError";
import jwt from 'jsonwebtoken'
import { jwtSignUpSecretKey } from "../const/environment";

interface ICheckVerifyToken {
    checkSignUpToken(): (req: Request, res: Response, next: NextFunction) => void
}

export class CheckVerifyToken implements ICheckVerifyToken  {
    private readonly customError: CustomError

    constructor () {
        this.customError = new CustomError()
    }
    
    checkSignUpToken(): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const signUpTokenHeader = req.headers.authorization

                if (!signUpTokenHeader) {
                    throw new CustomError().badRequestException('signUp token header is missing')
                } else {
                    const signUpTokenDecoded = jwt.verify(signUpTokenHeader, jwtSignUpSecretKey)

                    req.body.signUpTokenDecoded = signUpTokenDecoded

                    next()
                }
            } catch (err) {
                next(err)
            }
        }
    }
}