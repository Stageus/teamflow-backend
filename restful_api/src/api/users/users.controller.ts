import { NextFunction, Request, Response } from "express";
import crypto from 'node:crypto'
import { ouath2Client } from "../../common/const/googleOAuthClient";
import { ResponseFilter } from "../../common/responseFilter/responseFilter";
import axios from "axios";
import { googleClientId, googleClientSecret, googleRedirectUrl } from "../../common/const/environment";
import { CustomError } from "../../common/exception/customError";
import { UserDto } from "./dto/users.dto";
import { UserService } from "./users.service";

interface IUserController {
    googleLogin(req: Request, res: Response, next: NextFunction): void
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
        const scopes = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ]

        const state = crypto.randomBytes(32).toString("hex")

        const authorizationUrl = ouath2Client.generateAuthUrl({
            access_type: "offline",
            include_granted_scopes: true,
            scope: scopes,
            state: state,
            response_type: "code"
        })

        this.responseFilter.response200({ url: authorizationUrl })(req, res, next)
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
                redircet_url: googleRedirectUrl,
                grant_type: 'authorization_code'
            },
            {
                headers: {
                    'Content-Type': 'application/json'
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

        const isUser = await this.userService.selectUser(userDto)

        if (typeof isUser.userIdx === "undefined") {
            
        }
    }
}