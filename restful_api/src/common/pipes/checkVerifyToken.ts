import { NextFunction, Request, Response } from "express";
import { CustomError } from "../custom/customError";
import jwt from 'jsonwebtoken'
import { jwtAccessSecretKey, jwtRefreshSecretKey, jwtSignUpSecretKey } from "../const/environment";
import { generateAccessToken } from "../utils/generateToken";

interface ICheckVerifyToken {
    checkVerifySignUpToken(): (req: Request, res: Response, next: NextFunction) => void
    checkVerifyAccessToken(): (req: Request, res: Response, next: NextFunction) => void
}

export class CheckVerifyToken implements ICheckVerifyToken  {
    private readonly customError: CustomError

    constructor () {
        this.customError = new CustomError()
    }

    checkVerifySignUpToken(): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => {
            try {
                const signUpTokenHeader = req.headers.authorization

                if (!signUpTokenHeader) {
                    throw this.customError.badRequestException('signUp token header is missing')
                } else {
                    const signUpTokenDecoded = jwt.verify(
                        signUpTokenHeader, 
                        jwtSignUpSecretKey) as jwt.JwtPayload

                    req.body.email = signUpTokenDecoded.email
                    req.body.profile = signUpTokenDecoded.profile

                    next()
                }
            } catch (err) {
                next(err)
            }
        }
    }

    checkVerifyAccessToken(): (req: Request, res: Response, next: NextFunction) => void {
        return (req, res, next) => {
            try {
                const accessTokenHeader = req.headers.authorization
                const refreshToken = req.cookies.refreshToken

                if (!accessTokenHeader) {
                    throw this.customError.unauthorizedException('access token header is missing')
                }

                if (!refreshToken) {
                    throw this.customError.unauthorizedException('need to login')
                }

                let accessTokenValid = false

                jwt.verify(accessTokenHeader, jwtAccessSecretKey, (err, decoded) => {
                    if (err) {
                        accessTokenValid = false
                    } else {
                        accessTokenValid = true
                    }
                })

                let accessTokenDecoded

                if (!accessTokenValid) {
                    const refreshTokenDecoded = jwt.verify(
                        refreshToken,
                        jwtRefreshSecretKey
                    ) as jwt.JwtPayload

                    const accessToken = generateAccessToken(
                        refreshTokenDecoded.userIdx
                    )

                    accessTokenDecoded = jwt.verify(
                        accessToken, 
                        jwtAccessSecretKey
                    ) as jwt.JwtPayload

                    req.body.accessToken = accessToken
                } else {
                    accessTokenDecoded = jwt.verify(
                        accessTokenHeader,
                        jwtAccessSecretKey
                    ) as jwt.JwtPayload
                }

                req.body.userIdx = accessTokenDecoded.userIdx

                next()
            } catch (err) {
                next(err)
            }
        }
    }
}