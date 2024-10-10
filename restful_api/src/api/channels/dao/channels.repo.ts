import { Pool } from "pg";
import { ChannelEntity } from "../entity/channel.entity";
import { ChannelDto } from "../dto/channel.dto";
import { ChannelMemberEntity } from "../entity/channelMember.entity";

interface IChannelRepository {
    createChannel (channelEntity: ChannelEntity, conn: Pool): Promise<void>
    getChannelOwner (channelEntity: ChannelEntity, conn: Pool): Promise<void>
    putChannelName (channelEntity: ChannelEntity, conn: Pool): Promise<void> 
}

export class ChannelRepository implements IChannelRepository {
    constructor(
        private readonly pool : Pool
    ) {}

    async createChannel (channelEntity: ChannelEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query('BEGIN')
        const chIdxQueryResult = await conn.query(
            `INSERT INTO team_flow_management.channel (ts_idx, ch_type_idx, owner_idx, ch_name) VALUES ($1, $2, $3, $4) RETURNING ch_idx`,
            [channelEntity.teamSpaceIdx, channelEntity.chTypeIdx, channelEntity.ownerIdx, channelEntity.channelName]
        )

        channelEntity.channelIdx = chIdxQueryResult.rows[0].ch_idx

        await conn.query(
            `INSERT INTO team_flow_management.private_ch_member (ch_idx, user_idx) VALUES ($1, $2)`,
            [channelEntity.channelIdx, channelEntity.ownerIdx]
        )
        await conn.query('COMMIT')
    }

    async getChannelOwner (channelEntity: ChannelEntity, conn: Pool = this.pool): Promise<void> {
        const channelOwnerQueryResult = await conn.query(
            `SELECT owner_idx FROM team_flow_management.channel WHERE ch_idx=$1`,
            [channelEntity.channelIdx]
        )

        channelEntity.ownerIdx = channelOwnerQueryResult.rows[0].owner_idx
    }

    async putChannelName (channelEntity: ChannelEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `UPDATE team_flow_management.channel SET ch_name=$1 WHERE ch_idx=$2`,
            [channelEntity.channelName, channelEntity.channelIdx]
        )
    }

    async deleteChannel (channelEntity: ChannelEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `DELETE FROM team_flow_management.channel WHERE owner_idx=$1`,
            [channelEntity.ownerIdx]
        )
    }

    async deleteChannelUser(channelMemberEntity: ChannelMemberEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query('BEGIN')
        await conn.query(
            `DELETE FROM team_flow_management.private_ch_member WHERE ch_idx=$1 AND user_idx=$2`,
            [channelMemberEntity.channelIdx, channelMemberEntity.channelUserIdx]
        )
        await conn.query(
            `UPDATE team_flow_management.thread SET user_idx=null WHERE ch_idx=$1 AND user_idx=$2`,
            [channelMemberEntity.channelIdx, channelMemberEntity.channelUserIdx]
        )
        await conn.query('COMMIT')
    }
}