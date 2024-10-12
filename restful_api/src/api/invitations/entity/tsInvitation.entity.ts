import { CustomError } from "../../../common/exception/customError"
import { Request, Response, NextFunction } from 'express'

interface ITSInvitationEntity {
    tsInvitationIdx: number | undefined,
    teamSpaceIdx: number | undefined,
    email: string | undefined,
    invitedAt: Date | undefined
}

export class TSInvitationEntity implements ITSInvitationEntity {
    tsInvitationIdx: number | undefined
    teamSpaceIdx: number | undefined
    email: string | undefined
    invitedAt: Date | undefined

    constructor(data?: Partial<ITSInvitationEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}