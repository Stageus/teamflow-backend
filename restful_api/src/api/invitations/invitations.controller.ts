import { Request, Response, NextFunction } from 'express'
import { InvitationService } from './invitations.service';
import { TSInvitationDto } from './dto/tsInvitation.dto';
import { UserDto } from '../users/dto/users.dto';
import { ChInvitationDto } from './dto/chInvitation.dto';

interface IInvitationController {
    addTSInvited(req: Request, res: Response, next: NextFunction): Promise<void>
}

export class InvitationController implements IInvitationController {
    constructor(
        private readonly invitationService: InvitationService
    ){}

    async addTSInvited(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })
        
        const tsInvitationDto = new TSInvitationDto({
            teamSpaceIdx: req.body.teamSpaceIdx,
            toEmail: req.body.email
        })

        await this.invitationService.createTSInvited(userDto, tsInvitationDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken: req.body.accessToken })
        }
    }

    async addChannelInvited(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })

        const chInviationDto = new ChInvitationDto({
            channelIdx: req.body.channelIdx,
            userIdx: req.body.channelUserIdx
        })

        await this.invitationService.createChannelInvitation(userDto, chInviationDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken: req.body.accessToken })
        }
    }
}