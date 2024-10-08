import { CustomError } from "../../../common/exception/customError"
import { Request, Response, NextFunction } from 'express'

interface ITeamSpaceDto {
    ownerIdx?: number
    teamSpaceName?: string
    teamSpaceIdx?: number
}

export class TeamSpaceDto implements ITeamSpaceDto {
    private customError: CustomError

    ownerIdx?: number
    teamSpaceName?: string
    teamSpaceIdx?: number

    constructor(data?: Partial<ITeamSpaceDto>) {
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