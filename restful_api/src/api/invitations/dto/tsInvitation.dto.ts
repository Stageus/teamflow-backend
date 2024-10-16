import { CustomError } from "../../../common/exception/customError"
import { Request, Response, NextFunction } from 'express'

interface ITSInvitationDto {
    teamSpaceIdx: number | undefined,
    email: string | undefined,
    invitedAt: Date | undefined,
    sendEmail: string | undefined,
    sendNickname: string | undefined,
    toEmail: string | undefined,
    teamSpaceName: string | undefined
}

export class TSInvitationDto implements ITSInvitationDto {
    teamSpaceIdx: number | undefined
    email: string | undefined
    invitedAt: Date | undefined
    sendEmail: string | undefined
    sendNickname: string | undefined
    toEmail: string | undefined
    teamSpaceName: string | undefined

    constructor(data?: Partial<ITSInvitationDto>) {
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