import { MongoClient } from "mongodb";
import { Pool } from "pg";
import { CustomError } from "../../common/exception/customError";
import { NotificationRepository } from "./dao/notifications.repo";
import { NotificationDto } from "./dto/notification.dto";
import { UserRepository } from "../users/dao/users.repo";
import { UserEntity } from "../users/entity/users.entity";
import { InvitedNotificationEntity } from "./entity/invitedNotification.entity";
import { InvitedNotificationDto } from "./dto/invitedNotification.dto";
import { tsInvitation } from "../../common/const/notification_type";

interface INotificationService {

}

export class NotificationService implements INotificationService {
    private customError: CustomError

    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly userRepository: UserRepository,
        private readonly pool: Pool,
        private readonly client: MongoClient
    ) {
        this.customError = new CustomError()
    }

    async selectInvitationList(notificationDto: NotificationDto): Promise<InvitedNotificationDto[]> {
        const userEntity = new UserEntity({
            userIdx: notificationDto.userIdx
        }) 

        await this.userRepository.getUserEmail(userEntity, this.pool)

        const invitedNotificationEntity = new InvitedNotificationEntity({
            sendToUserEmail: userEntity.email,
            sendToUserIdx: notificationDto.userIdx
        })

        const invitedEntityList = await this.notificationRepository.getInvitationList(invitedNotificationEntity, this.client)
        const invitedDtoList: InvitedNotificationDto[] = []

        for (let i = 0; i < invitedEntityList.length; i++) {
            const notification = new InvitedNotificationDto()

            if (invitedEntityList[i].notificationTypeIdx === tsInvitation) {
                notification.notificationIdx = invitedEntityList[i].notificationIdx
                notification.teamSpaceIdx = invitedEntityList[i].teamSpaceIdx
                notification.createdAt = invitedEntityList[i].createdAt
            } else {
                notification.notificationIdx = invitedEntityList[i].notificationIdx
                notification.channelIdx = invitedEntityList[i].channelIdx
                notification.createdAt = invitedEntityList[i].createdAt
            }

            invitedDtoList.push(notification)
        }

        return invitedDtoList
    }
}