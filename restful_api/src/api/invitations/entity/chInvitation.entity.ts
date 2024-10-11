import { CustomError } from "../../../common/exception/customError"
import { Request, Response, NextFunction } from 'express'

interface IChInvitationEntity {
    tsInvitationIdx?: number,
    teamSpaceIdx?: number,
    email?: string,
    invitedAt?: Date
}

export class ChInvitationEntity implements IChInvitationEntity {
    tsInvitationIdx?: number
    teamSpaceIdx?: number
    email?: string
    invitedAt?: Date

    constructor(data?: Partial<IChInvitationEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}