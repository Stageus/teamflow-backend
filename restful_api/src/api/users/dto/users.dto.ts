import { NextFunction, Request, Response } from "express"
import { CustomError } from "../../../common/exception/customError"

interface IUserDto {
    userIdx?: number
    email?: string
    profile?: string
    nickname?: string
    teamSpaceOwnCount?: number
    teamSpaceCount?: number
}

export class UserDto implements IUserDto {
    private customError: CustomError

    userIdx?: number
    email?: string
    profile?: string
    nickname?: string
    teamSpaceOwnCount?: number
    teamSpaceCount?: number

    constructor(data?: Partial<IUserDto>) {
        if (data) {
            Object.assign(this, data)
        }

        this.customError = new CustomError()
    }

    checkRegx(params: [string, RegExp][]): (req: Request, res: Response, next: NextFunction) => void  {
        return (req, res, next) => {
            try {
                params.forEach(([paramName, paramRegx]) => {
                    const value = req.query[paramName] || req.params[paramName] || req.body[paramName]

                    if (!value.match(paramRegx)) {
                        throw this.customError.badRequestException(`${paramName}의 입력을 확인해야 함`)
                    }
                })

                next()
            } catch(err) {
                next(err)
            }
        }
    }
}