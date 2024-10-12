import { Request, Response, NextFunction } from 'express'
import { CustomError } from "../../../common/exception/customError"

interface IChannelDto {
    teamSpaceIdx: number | undefined,
    channelName: string | undefined
    ownerIdx?: number | undefined,
    channelIdx: number | undefined,
    searchWord: string | undefined
}

export class ChannelDto implements IChannelDto {
    teamSpaceIdx: number | undefined
    channelName: string | undefined
    ownerIdx?: number | undefined
    channelIdx: number | undefined
    searchWord: string | undefined

    constructor(data?: Partial<IChannelDto>) {
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