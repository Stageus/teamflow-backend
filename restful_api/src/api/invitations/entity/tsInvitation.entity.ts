import { CustomError } from "../../../common/custom/customError"
import { Request, Response, NextFunction } from 'express'

interface ITSInvitationEntity {
    tsInvitationIdx?: number,
    teamSpaceIdx?: number,
    email?: string,
    invitedAt?: Date
}

export class TSInvitationEntity implements ITSInvitationEntity {
    tsInvitationIdx?: number
    teamSpaceIdx?: number
    email?: string
    invitedAt?: Date

    constructor(data?: Partial<ITSInvitationEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}