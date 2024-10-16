import { Pool } from "pg";
import { ThreadsEntity } from "../entity/threads.entity";

interface IThreadRepository {

}

export class ThreadRepository implements IThreadRepository {
    constructor(
        private readonly pool : Pool
    ){}

    async getThreadList(threadsEntity: ThreadsEntity, conn: Pool = this.pool): Promise<ThreadsEntity[]> {
        const threadsQueryResult = await conn.query(
            `SELECT * FROM team_flow_management.thread WHERE ch_idx=$1 ORDER BY created_at DESC`,
            [threadsEntity.channelIdx]
        )
        
        const threadList: ThreadsEntity[] = []

        for(let i = 0; i < threadsQueryResult.rows.length; i++) {
            const thread = new ThreadsEntity({
                channelIdx: threadsEntity.channelIdx
            })

            thread.threadIdx = threadsQueryResult.rows[i].thread_idx
            
            if (threadsQueryResult.rows[i].content) {
                thread.content = threadsQueryResult.rows[i].content
            }

            const fileQueryResult = await conn.query(
                `SELECT file_path FROM team_flow_management.thread_file WHERE thread_idx=$1 AND is_deleted=false ORDER BY file_order ASC`,
                [thread.threadIdx]
            )

            if (fileQueryResult.rows.length !== 0) {
                thread.file = []

                for (let j = 0; j < fileQueryResult.rows.length; j++) {
                    const file_path = fileQueryResult.rows[j].file_path
                    thread.file.push(file_path)
                }
            }

            thread.authorIdx = threadsQueryResult.rows[i].user_idx

            const authorNameQueryResult = await conn.query(
                `SELECT nickname FROM team_flow_management.user WHERE user_idx=$1`,
                [thread.authorIdx]
            )

            thread.authorName = authorNameQueryResult.rows[0].nickname
            thread.createdAt = threadsQueryResult.rows[i].created_at
            thread.isUpdated = threadsQueryResult.rows[i].is_updated
            thread.isMention = threadsQueryResult.rows[i].is_mention

            threadList.push(thread)
        }

        return threadList
    }
}