import { NextFunction, Request, Response } from "express";
import { NotificationService } from "./notifications.service";
import { NotificationDto } from "./dto/notification.dto";
import { InvitedNotificationDto } from "./dto/invitedNotification.dto";
import { UserDto } from "../users/dto/users.dto";

interface INotificationController {
    getInvitationList(req: Request, res: Response, next: NextFunction): Promise<void>
    acceptInvitationRequest(req: Request, res: Response, next: NextFunction): Promise<void>
    rejectInvitationRequest(req: Request, res: Response, next: NextFunction): Promise<void>
}

export class NotificationController implements INotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ){}

    async getInvitationList(req: Request, res: Response, next: NextFunction): Promise<void> {
        const notificationDto = new NotificationDto({
            userIdx: req.body.userIdx,
            page: Number(req.query.page)
        })

        const invitationList = await this.notificationService.selectInvitationList(notificationDto)
        
        if (!req.body.accessToken) {
            res.status(200).send([invitationList])
        } else {
            res.status(203).send([[invitationList], [{ accessToken: req.body.accessToken }]])
        }
    }

    async acceptInvitationRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx : req.body.userIdx
        })
        
        const invitedNotificationDto = new InvitedNotificationDto({
            notificationIdx: Number(req.params.notificationIdx)
        })

        await this.notificationService.acceptInvitation(userDto, invitedNotificationDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accesstoken: req.body.accessToken })
        }
    }

    async rejectInvitationRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx : req.body.userIdx
        })
        
        const invitedNotificationDto = new InvitedNotificationDto({
            notificationIdx: Number(req.params.notificationIdx)
        })

        await this.notificationService.rejectInvitation(userDto, invitedNotificationDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accesstoken: req.body.accessToken })
        }
    }
}