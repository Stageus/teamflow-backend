import { Pool } from "pg";
import { ThreadRepository } from "./dao/threads.repo";
import { UserRepository } from "../users/dao/users.repo";
import { CustomError } from "../../common/exception/customError";
import { ThreadsDto } from "./dto/threads.dto";
import { UserDto } from "../users/dto/users.dto";
import { ThreadsEntity } from "./entity/threads.entity";

interface IThreadService {
    selectThreadList(userDto: UserDto, threadsDto: ThreadsDto): Promise<ThreadsDto[]>
}

export class ThreadService implements IThreadService {
    private customError: CustomError

    constructor(
        private readonly threadsRepository: ThreadRepository,
        private readonly userRepository: UserRepository,
        private readonly pool : Pool
    ){
        this.customError = new CustomError()
    }

    async selectThreadList(userDto: UserDto, threadsDto: ThreadsDto): Promise<ThreadsDto[]> {
        const threadsEntity = new ThreadsEntity({
            channelIdx: threadsDto.channelIdx
        })

        const threadListEntity = await this.threadsRepository.getThreadList(threadsEntity, this.pool)

        if (threadListEntity.length === 0) {
            throw this.customError.notFoundException('thread가 없음')
        }

        const threadList: ThreadsDto[] = []
        
        for(let i = 0; i < threadListEntity.length; i++) {
            const thread = new ThreadsDto({
                channelIdx: threadsDto.channelIdx
            })

            thread.threadIdx = threadListEntity[i].threadIdx

            if (threadListEntity[i].content) {
                thread.content = threadListEntity[i].content
            }

            if (threadListEntity[i].file) {
                thread.file = []
                
                for (let j = 0; j < threadListEntity[i].file!.length; j++) {
                    const file_path = threadListEntity[i].file![j]
                    thread.file.push(file_path)
                }
            }

            thread.authorName = threadListEntity[i].authorName

            if (threadListEntity[i].authorIdx === userDto.userIdx) {
                thread.isAuthor = true
            } else {
                thread.isAuthor = false
            }

            thread.createdAt = threadListEntity[i].createdAt
            thread.isUpdated = threadListEntity[i].isUpdated
            thread.isMention = threadListEntity[i].isMention

            threadList.push(thread)
        }

        return threadList
    }
}