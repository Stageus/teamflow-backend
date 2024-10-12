import { Pool } from "pg";
import { TSInvitationEntity } from "../entity/tsInvitation.entity";
import { MongoClient } from "mongodb";
import { getSequenceNextValue } from "../../../common/utils/getSequenceNextValue";
import { UserEntity } from "../../users/entity/users.entity";
import { ChInvitationEntity } from "../entity/chInvitation.entity";

interface IInvitationRepository {
    getIsTSInvited(tsInvitationEntity: TSInvitationEntity, conn: Pool): Promise<void>
    deleteTsInvited(tsInvitationEntity: TSInvitationEntity, conn: Pool): Promise<void>
}

export class InvitationRepository implements IInvitationRepository {
    constructor(
        private readonly pool: Pool,
        private readonly client: MongoClient
    ){}

    async getIsTSInvited(tsInvitationEntity: TSInvitationEntity, conn: Pool = this.pool): Promise<void> {
        const isInvitedQueryResult = await conn.query(
            `SELECT ts_invitation_idx, invited_at FROM team_flow_management.ts_invitation WHERE ts_idx=$1 AND email=$2`,
            [tsInvitationEntity.teamSpaceIdx, tsInvitationEntity.email]
        )

        if (isInvitedQueryResult.rows.length !== 0) {
            tsInvitationEntity.tsInvitationIdx = isInvitedQueryResult.rows[0].ts_invitation_idx
            tsInvitationEntity.invitedAt = isInvitedQueryResult.rows[0].invited_at
        }
    }

    async deleteTsInvited(tsInvitationEntity: TSInvitationEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `DELETE FROM team_flow_management.ts_invitation WHERE ts_inviation_idx=$1`,
            [tsInvitationEntity.tsInvitationIdx]
        )
    }

    async addTSInvited(userEntity: UserEntity, tsInvitationEntity: TSInvitationEntity, conn: Pool = this.pool, mongoConn: MongoClient = this.client): Promise<void> {
        const tsInvitationIdxQueryResult = await conn.query(
            `INSERT INTO team_flow_management.ts_invitation (ts_idx, email) VALUES ($1, $2) RETURNING ts_invitation_idx`,
            [tsInvitationEntity.teamSpaceIdx, tsInvitationEntity.email]
        )

        const notificationEntry = {
            notification_idx: await getSequenceNextValue('notification_idx'),
            notification_type_idx: 1,
            inviation_idx: tsInvitationIdxQueryResult.rows[0].ts_invitation_idx,
            team_space_idx: tsInvitationEntity.teamSpaceIdx,
            send_by_user_idx: userEntity.userIdx,
            send_to_email: tsInvitationEntity.email,
            created_at: new Date(),
            is_read: false
        }

        await mongoConn.db('team_flow').collection('notification').insertOne(notificationEntry)
    }

    async getIsChannelInvited(chInvitationEntity: ChInvitationEntity, conn: Pool = this.pool): Promise<void> {
       const isChannelInvitedQueryResult = await conn.query(
            `SELECT private_ch_invitation_idx, invited_at FROM team_flow_management.private_ch_invitation WHERE ch_idx=$1 AND user_idx=$2`,
            [chInvitationEntity.channelIdx, chInvitationEntity.userIdx]
        )

        if (isChannelInvitedQueryResult.rows[0]) {
            chInvitationEntity.chInvitationIdx = isChannelInvitedQueryResult.rows[0].private_ch_invitation_idx,
            chInvitationEntity.invitedAt = isChannelInvitedQueryResult.rows[0].invited_at
        }
    }

    async deleteChannelInvited(chInvitationEntity: ChInvitationEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `DELETE FROM team_flow_management.private_ch_invitation WHERE private_ch_invitation_idx=$1`,
            [chInvitationEntity.chInvitationIdx]
        )
    }

    async addChannelInvited(userEntity: UserEntity, chInvitationEntity: ChInvitationEntity, conn: Pool = this.pool, mongoConn: MongoClient = this.client): Promise<void> {
        const chInvitationIdxQueryResult = await conn.query(
            `INSERT INTO team_flow_management.private_ch_invitation (ch_idx, user_idx) VALUES ($1, $2) RETURNING private_ch_invitation_idx`,
            [chInvitationEntity.channelIdx, chInvitationEntity.userIdx]
        )

        const notificationEntry = {
            notification_idx: await getSequenceNextValue('notification_idx'),
            notification_type_idx: 2,
            invitation_idx: chInvitationIdxQueryResult.rows[0].private_ch_invitation_idx,
            private_channel_idx: chInvitationEntity.channelIdx,
            send_by_user_idx: userEntity.userIdx,
            send_to_user_idx: chInvitationEntity.userIdx,
            created_at: new Date(),
            is_read: false
        }

        await mongoConn.db('team_flow').collection('notification').insertOne(notificationEntry)
    }
}