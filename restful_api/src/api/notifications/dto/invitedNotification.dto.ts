import { CustomError } from "../../../common/exception/customError"
import { Request, Response, NextFunction } from "express"

interface IInvitedNotificationDto {
    notificationIdx: number | undefined,
    teamSpaceIdx: number | undefined,
    channelIdx: number | undefined,
    createdAt: Date | undefined,
}

export class InvitedNotificationDto implements IInvitedNotificationDto {
    notificationIdx: number | undefined
    teamSpaceIdx: number | undefined
    channelIdx: number | undefined
    createdAt: Date | undefined

    constructor(data?: Partial<IInvitedNotificationDto>) {
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