import { Request, Response, NextFunction } from 'express'
import { CustomError } from "../../../common/exception/customError"

interface IChannelMemberDto {
    teamSpaceIdx?: number,
    channelName?: string
    channelUserIdx?: number,
    channelIdx?: number,
}

export class ChannelMemberDto implements IChannelMemberDto {
    teamSpaceIdx?: number
    channelName?: string
    channelUserIdx?: number
    channelIdx?: number

    constructor(data?: Partial<IChannelMemberDto>) {
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