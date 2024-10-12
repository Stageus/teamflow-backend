import { CustomError } from "../../../common/exception/customError"
import { Request, Response, NextFunction } from 'express'

interface IChInvitationEntity {
    chInvitationIdx: number | undefined,
    channelIdx: number | undefined,
    userIdx: number | undefined,
    invitedAt: Date | undefined
}

export class ChInvitationEntity implements IChInvitationEntity {
    chInvitationIdx: number | undefined
    channelIdx: number | undefined
    userIdx: number | undefined
    invitedAt: Date | undefined

    constructor(data?: Partial<IChInvitationEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}