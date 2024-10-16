import { Pool } from "pg";
import { ThreadsEntity } from "../entity/threads.entity";

interface IThreadRepository {
    getThreadList(threadsEntity: ThreadsEntity, conn: Pool): Promise<any[]>
    getThreadFileList(threadIdx: number, conn: Pool): Promise<any[]>
}

export class ThreadRepository implements IThreadRepository {
    constructor(
        private readonly pool : Pool
    ){}

    async getThreadList(threadsEntity: ThreadsEntity, conn: Pool = this.pool): Promise<any[]> {
        const threadsQueryResult = await conn.query(
            `SELECT * FROM team_flow_management.thread WHERE ch_idx=$1 ORDER BY created_at DESC`,
            [threadsEntity.channelIdx]
        )

        return threadsQueryResult.rows
    }

    async getThreadFileList(threadIdx: number, conn: Pool = this.pool): Promise<any[]> {
        const fileQueryResult = await conn.query(
            `SELECT file_path FROM team_flow_management.thread_file WHERE thread_idx=$1 AND is_deleted=false ORDER BY file_order ASC`,
            [threadIdx]
        )

        return fileQueryResult.rows
    }
}