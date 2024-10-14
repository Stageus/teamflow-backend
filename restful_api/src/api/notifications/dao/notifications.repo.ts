import { MongoClient } from "mongodb";
import { Pool } from "pg";
import { InvitedNotificationEntity } from "../entity/invitedNotification.entity";
import { tsInvitation } from "../../../common/const/notification_type";

interface INotificationRepository {

}

export class NotificationRepository implements INotificationRepository {
    constructor(
        private readonly pool: Pool,
        private readonly client: MongoClient
    ){}

    async getInvitationList(invitedNotificationEntity: InvitedNotificationEntity, mongoConn: MongoClient = this.client): Promise<InvitedNotificationEntity[]> {
        const invitationListResult = await mongoConn.db("team_flow").collection("notification").find({
            $or: [
                { send_to_email : invitedNotificationEntity.sendToUserEmail },
                { send_to_user_idx : invitedNotificationEntity.sendToUserIdx }
            ]
        }).sort({ created_at: -1 })

        const invitationList = await invitationListResult.toArray()
        const invitedEntityList: InvitedNotificationEntity[] = []

        for (let i = 0; i < invitationList.length; i++) {
            const notification = new InvitedNotificationEntity()

            if (invitationList[i].notification_type_idx === tsInvitation) {
                notification.notificationIdx = invitationList[i].notification_idx
                notification.notificationTypeIdx = invitationList[i].notification_type_idx
                notification.teamSpaceIdx = invitationList[i].team_space_idx
                notification.createdAt = invitationList[i].created_at
            } else {
                notification.notificationIdx = invitationList[i].notification_idx
                notification.notificationTypeIdx = invitationList[i].notification_type_idx
                notification.channelIdx = invitationList[i].private_channel_idx
                notification.createdAt = invitationList[i].created_at
            }

            invitedEntityList.push(notification)
        }

        return invitedEntityList
    }
}