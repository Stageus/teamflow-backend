import { NextFunction, Request, Response } from "express";
import { NotificationService } from "./notifications.service";
import { NotificationDto } from "./dto/notification.dto";

interface INotificationController {

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
}