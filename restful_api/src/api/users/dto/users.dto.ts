import { NextFunction, Request, Response } from "express"
import { CustomError } from "../../../common/exception/customError"

interface IUserDto {
    userIdx: number | undefined
    email: string | undefined
    profile: string | undefined
    nickname: string | undefined
    teamSpaceOwnCount: number | undefined
    teamSpaceCount: number | undefined
}

export class UserDto implements IUserDto {
    userIdx: number | undefined
    email: string | undefined
    profile: string | undefined
    nickname: string | undefined
    teamSpaceOwnCount: number | undefined
    teamSpaceCount: number | undefined

    constructor(data?: Partial<IUserDto>) {
        if (data) {
            Object.assign(this, data)
        }
    }

    checkRegx(params: [string, RegExp][]): (req: Request, res: Response, next: NextFunction) => void  {
        const customError = new CustomError()
        
        return (req, res, next) => {
            try {
                params.forEach(([paramName, paramRegx]) => {
                    const value = req.query[paramName] || req.params[paramName] || req.body[paramName]

                    if (!value.toString().match(paramRegx)) {
                        throw customError.badRequestException(`${paramName}의 입력을 확인해야 함`)
                    }
                })

                next()
            } catch(err) {
                next(err)
            }
        }
    }
}