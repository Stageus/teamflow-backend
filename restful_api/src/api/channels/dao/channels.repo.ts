import { Pool } from "pg";
import { ChannelEntity } from "../entity/channel.entity";

interface IChannelRepository {

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
}