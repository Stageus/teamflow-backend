import { NextFunction, Request, Response } from "express";
import crypto from 'node:crypto'
import { ouath2Client } from "../../common/const/googleOAuthClient";
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
    private customError: CustomError

    constructor(
        private readonly userService: UserService
    ) {
        this.customError = new CustomError()
    }

    googleLogin(req: Request, res: Response, next: NextFunction): void {
        const state = crypto.randomBytes(32).toString("hex")
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&access_type=offline&redirect_uri=${googleRedirectUrl}&response_type=code&state=${state}&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`

        res.status(200).send({
            redirectUrl: googleAuthUrl
        })
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

        await this.userService.selectUserByEmail(userDto)

        if (!userDto.userIdx) {
            const signUpToken = generateSignUpToken(userDto)

            res.status(203).send({ signUpToken : signUpToken })
        } else {
            const accessToken = generateAccessToken(userDto)
            const refershToken = generateRefreshToken(userDto)

            res.cookie("refreshToken", refershToken, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 3600 * 24,
                sameSite: "strict"
            })
            
            res.status(203).send({ accessToken : accessToken })
        }
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        const userDto = new UserDto({
            nickname : req.body.nickname,
            email : req.body.signUpTokenDecoded.email,
            profile: req.body.signUpTokenDecoded.profile
        })

        await this.userService.createUser(userDto)

        res.status(200).send()
    }

    async getUserInfo(req: Request, res: Response, next: NextFunction) {
        const userDto = new UserDto({
            userIdx : req.body.userIdx
        })

        await this.userService.selectUserInfo(userDto)

        if (!req.body.accessToken) {
            res.status(200).send({
                userIdx: userDto.userIdx,
                nickname: userDto.nickname,
                email: userDto.email,
                profileImage: userDto.profile,
                teamSpaceOwnCount: userDto.teamSpaceOwnCount,
                teamSpaceCount: userDto.teamSpaceCount
            })
        } else {
            res.status(203).send({
                userIdx: userDto.userIdx,
                nickname: userDto.nickname,
                email: userDto.email,
                profileImage: userDto.profile,
                teamSpaceOwnCount: userDto.teamSpaceOwnCount,
                teamSpaceCount: userDto.teamSpaceCount,
                accessToken: req.body.accessToken
            })
        }
    }
}