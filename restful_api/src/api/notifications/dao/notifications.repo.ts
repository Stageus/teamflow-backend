import { MongoClient } from "mongodb";
import { Pool } from "pg";
import { InvitedNotificationEntity } from "../entity/invitedNotification.entity";
import { chInvitation, tsInvitation } from "../../../common/const/notification_type";
import { member } from "../../../common/const/ts_role";

interface INotificationRepository {
    getInvitationList(page: number, invitedNotificationEntity: InvitedNotificationEntity, mongoConn: MongoClient): Promise<InvitedNotificationEntity[]> 
    getInvitation(invitatedNotificationEntity: InvitedNotificationEntity, mongoConn: MongoClient): Promise<void>
    acceptTSInvitation(invitedNotificationEntity: InvitedNotificationEntity, conn: Pool): Promise<void>
    acceptChInvitation(invitatedNotificationEntity: InvitedNotificationEntity, conn: Pool): Promise<void>
    rejectTSInvitation(invitedNotificationEntity: InvitedNotificationEntity, conn: Pool): Promise<void>
    rejectChInvitation(invitatedNotificationEntity: InvitedNotificationEntity, conn: Pool): Promise<void>
}

export class NotificationRepository implements INotificationRepository {
    constructor(
        private readonly pool: Pool,
        private readonly client: MongoClient
    ){}

    async getInvitationList(page: number, invitedNotificationEntity: InvitedNotificationEntity, mongoConn: MongoClient = this.client): Promise<InvitedNotificationEntity[]> {
        const invitationListResult = await mongoConn.db("team_flow").collection("notification").find({
            $or: [
                { send_to_email : invitedNotificationEntity.sendToUserEmail },
                { send_to_user_idx : invitedNotificationEntity.sendToUserIdx }
            ],
            $and: [
                { is_read : false }
            ]
        }).sort({ created_at: -1 }).limit(10).skip(10 * page)

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

    async getInvitation(invitatedNotificationEntity: InvitedNotificationEntity, mongoConn: MongoClient = this.client): Promise<void> {
        const invitationQueryResult = await mongoConn.db("team_flow").collection("notification").find({notification_idx: invitatedNotificationEntity.notificationIdx})
        const invitationResult = await invitationQueryResult.toArray()

        await mongoConn.db("team_flow").collection("notification").updateOne({notification_idx: invitatedNotificationEntity.notificationIdx}, {$set: {is_read: true}})

        invitatedNotificationEntity.invitationIdx = invitationResult[0].invitation_idx
        invitatedNotificationEntity.notificationTypeIdx = invitationResult[0].notification_type_idx
        invitatedNotificationEntity.createdAt = invitationResult[0].created_at

        if (invitatedNotificationEntity.notificationTypeIdx === tsInvitation) {
            invitatedNotificationEntity.teamSpaceIdx = invitationResult[0].team_space_idx
        }

        if (invitatedNotificationEntity.notificationTypeIdx === chInvitation) {
            invitatedNotificationEntity.channelIdx = invitationResult[0].private_channel_idx
        }
    }

    async acceptTSInvitation(invitedNotificationEntity: InvitedNotificationEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(`BEGIN`)
        await conn.query(
            `DELETE FROM team_flow_management.ts_invitation WHERE ts_invitation_idx=$1`,
            [invitedNotificationEntity.invitationIdx]
        )
        await conn.query(
            `INSERT INTO team_flow_management.ts_member (user_idx, ts_role_idx, ts_idx) VALUES ($1, $2, $3)`,
            [invitedNotificationEntity.sendToUserIdx, member, invitedNotificationEntity.teamSpaceIdx]
        )
        await conn.query(`COMMIT`)
    }

    async acceptChInvitation(invitatedNotificationEntity: InvitedNotificationEntity, conn: Pool = this. pool): Promise<void> {
        await conn.query(`BEGIN`)
        await conn.query(
            `DELETE FROM team_flow_management.private_ch_invitation WHERE private_ch_invitation_idx=$1`,
            [invitatedNotificationEntity.invitationIdx]
        )
        await conn.query(
            `INSERT INTO team_flow_management.private_ch_member (ch_idx, user_idx) VALUES ($1, $2)`,
            [invitatedNotificationEntity.channelIdx, invitatedNotificationEntity.sendToUserIdx]
        )
        await conn.query(`COMMIT`)
    }

    async rejectTSInvitation(invitedNotificationEntity: InvitedNotificationEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `DELETE FROM team_flow_management.ts_invitation WHERE ts_invitation_idx=$1`,
            [invitedNotificationEntity.invitationIdx]
        )
    }

    async rejectChInvitation(invitatedNotificationEntity: InvitedNotificationEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `DELETE FROM team_flow_management.private_ch_invitation WHERE private_ch_invitation_idx=$1`,
            [invitatedNotificationEntity.invitationIdx]
        )
    }
}