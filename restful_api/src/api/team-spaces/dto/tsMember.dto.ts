import { Request, Response, NextFunction } from 'express'
import { CustomError } from "../../../common/exception/customError"

interface ITSMemberDto {
    tsUserIdx?: number,
    roleIdx?: number,
    teamSpaceIdx?: number,
    searchWord?: string
}

export class TSMemberDto implements ITSMemberDto {
    tsUserIdx?: number
    roleIdx?: number
    teamSpaceIdx?: number
    searchWord?: string

    constructor(data?: Partial<ITSMemberDto>) {
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

                    if (!value.match(paramRegx)) {
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