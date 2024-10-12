import { Pool } from "pg";
import { TSInvitationEntity } from "../entity/tsInvitation.entity";
import { MongoClient } from "mongodb";
import { getSequenceNextValue } from "../../../common/utils/getSequenceNextValue";
import { UserEntity } from "../../users/entity/users.entity";

interface IInvitationRepository {

}

export class InvitationRepository implements IInvitationRepository {
    constructor(
        private readonly pool: Pool,
        private readonly client: MongoClient
    ){}

    async getIsInvited(tsInvitationEntity: TSInvitationEntity, conn: Pool = this.pool): Promise<void> {
        const isInvitedQueryResult = await conn.query(
            `SELECT ts_invitation_idx, invited_at FROM team_flow_management.ts_invitation WHERE ts_idx=$1 AND email=$2`,
            [tsInvitationEntity.teamSpaceIdx, tsInvitationEntity.email]
        )

        if (isInvitedQueryResult.rows[0]) {
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
        await conn.query(
            `INSERT INTO team_flow_management.ts_invitation (ts_idx, email) VALUES ($1, $2)`,
            [tsInvitationEntity.teamSpaceIdx, tsInvitationEntity.email]
        )

        const notificationEntry = {
            notification_idx: await getSequenceNextValue('notification_idx'),
            notification_type_idx: 1,
            source_idx: tsInvitationEntity.teamSpaceIdx,
            send_by_user_idx: userEntity.userIdx,
            send_to_email: tsInvitationEntity.email,
            created_at: new Date(),
            is_read: false
        }

        await mongoConn.db('team_flow').collection('notification').insertOne(notificationEntry)
    }
}