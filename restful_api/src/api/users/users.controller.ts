import { NextFunction, Request, Response } from "express";
import crypto from 'node:crypto'
import { ouath2Client } from "../../common/const/googleOAuthClient";
import { ResponseFilter } from "../../common/responseFilter/responseFilter";
import axios from "axios";
import { googleClientId, googleClientSecret, googleRedirectUrl } from "../../common/const/environment";
import { CustomError } from "../../common/exception/customError";
import { UserDto } from "./dto/users.dto";
import { UserService } from "./users.service";
import { generateAccessToken, generateRefreshToken, generateSignUpToken } from "../../common/utils/generateToken";
import { regx } from "../../common/const/regx";

interface IUserController {
    googleLogin(req: Request, res: Response, next: NextFunction): void
    googleLoginCallback(req: Request, res: Response, next: NextFunction): Promise<void>
}

export class UserController implements IUserController {
    private responseFilter: ResponseFilter
    private customError: CustomError

    constructor(
        private readonly userService: UserService
    ) {
        this.responseFilter = new ResponseFilter()
        this.customError = new CustomError()
    }

    googleLogin(req: Request, res: Response, next: NextFunction): void {
        const state = crypto.randomBytes(32).toString("hex")
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&access_type=offline&redirect_uri=${googleRedirectUrl}&response_type=code&state=${state}&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`

        this.responseFilter.response200({ url: googleAuthUrl })(req, res, next)
    }

    async googleLoginCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authorizationCode = req.query.code as string

        if (req.query.error === "access_denied") {
            this.customError.forbiddenException('사용자가 수집 정보를 비동의 함')
        }

        const token_response = await axios.post<{ access_token : string }>(
            'https://oauth2.googleapis.com/token',
            {
                code: authorizationCode,
                client_id: googleClientId,
                client_secret: googleClientSecret,
                redirect_uri: googleRedirectUrl,
                grant_type: 'authorization_code'
            },
            {
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }
        )

        const tokens = token_response.data
        ouath2Client.setCredentials(tokens)

        const userInfoResponse = await axios.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
                headers: { Authorization: `Bearer ${tokens.access_token}`}
            }
        )

        const googleEmail = userInfoResponse.data.email
        const googleProfileImage = userInfoResponse.data.picture

        const userDto = new UserDto({
            email: googleEmail,
            profile: googleProfileImage
        })

        await this.userService.selectUser(userDto)

        if (!userDto.userIdx) {
            const signUpToken = generateSignUpToken(userDto)

            this.responseFilter.response203({ signUpToken : signUpToken })(req, res, next)
        } else {
            const accessToken = generateAccessToken(userDto)
            const refershToken = generateRefreshToken(userDto)

            res.cookie("refreshToken", refershToken, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 3600 * 24,
                sameSite: "strict"
            })
            
            this.responseFilter.response203({ accessToken : accessToken })(req, res, next)
        }
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        const userDto = new UserDto({
            nickname : req.body.nickname,
            email : req.body.signUpTokenDecoded.email,
            profile: req.body.signUpTokenDecoded.profile
        })

        await this.userService.createUser(userDto)

        this.responseFilter.response200()(req, res, next)
    }

    async getUserInfo(req: Request, res: Response, next: NextFunction) {

    }
}