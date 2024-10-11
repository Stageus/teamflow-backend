import { CustomError } from "../../../common/custom/customError"
import { Request, Response, NextFunction } from 'express'

interface IChInvitationEntity {
    tsInvitationIdx: number | undefined,
    teamSpaceIdx: number | undefined,
    email: string | undefined,
    invitedAt: Date | undefined
}

export class ChInvitationEntity implements IChInvitationEntity {
    tsInvitationIdx: number | undefined
    teamSpaceIdx: number | undefined
    email: string | undefined
    invitedAt: Date | undefined

    constructor(data?: Partial<IChInvitationEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}