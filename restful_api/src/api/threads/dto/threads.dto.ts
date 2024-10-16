import { CustomError } from "../../../common/exception/customError"
import { Request, Response, NextFunction } from 'express'

interface IThreadsDto {
    threadIdx: number | undefined,
    channelIdx: number | undefined,
    content: string | undefined,
    file: string[] | undefined,
    authorIdx: number | undefined,
    authorName: string | undefined,
    isAuthor: boolean | undefined,
    createdAt : Date | undefined,
    isUpdated : boolean | undefined,
    isMention : boolean | undefined
}

export class ThreadsDto implements IThreadsDto {
    threadIdx: number | undefined
    channelIdx: number | undefined
    content: string | undefined
    file: string[] | undefined
    authorIdx: number | undefined
    authorName: string | undefined
    isAuthor: boolean | undefined
    createdAt: Date | undefined
    isUpdated: boolean | undefined
    isMention: boolean | undefined

    constructor(data?: Partial<IThreadsDto>) {
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