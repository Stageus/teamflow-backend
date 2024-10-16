import { Pool } from "pg";
import { ThreadRepository } from "./dao/threads.repo";
import { UserRepository } from "../users/dao/users.repo";
import { CustomError } from "../../common/exception/customError";
import { ThreadsDto } from "./dto/threads.dto";
import { UserDto } from "../users/dto/users.dto";
import { ThreadsEntity } from "./entity/threads.entity";
import { ChannelRepository } from "../channels/dao/channels.repo";
import { ChannelMemberEntity } from "../channels/entity/channelMember.entity";

interface IThreadService {
    selectThreadList(userDto: UserDto, threadsDto: ThreadsDto): Promise<ThreadsDto[]>
}

export class ThreadService implements IThreadService {
    private customError: CustomError

    constructor(
        private readonly threadsRepository: ThreadRepository,
        private readonly channelRepository: ChannelRepository,
        private readonly userRepository: UserRepository,
        private readonly pool : Pool
    ){
        this.customError = new CustomError()
    }

    async selectThreadList(userDto: UserDto, threadsDto: ThreadsDto): Promise<ThreadsDto[]> {
        const threadsEntity = new ThreadsEntity({
            channelIdx: threadsDto.channelIdx
        })

        const channelMemberEntity = new ChannelMemberEntity({
            channelIdx: threadsDto.channelIdx,
            channelUserIdx: userDto.userIdx
        })

        const isChannelUser = await this.channelRepository.getIsChannelUser(channelMemberEntity, this.pool)

        console.log(userDto.userIdx)
        console.log(isChannelUser)

        if (!isChannelUser) {
            throw this.customError.forbiddenException('channel 소속 user가 아님')
        }

        const threadListEntity = await this.threadsRepository.getThreadList(threadsEntity, this.pool)

        if (threadListEntity.length === 0) {
            throw this.customError.notFoundException('thread가 없음')
        }

        const threadList: ThreadsDto[] = []
        
        for(let i = 0; i < threadListEntity.length; i++) {
            const thread = new ThreadsDto({
                channelIdx: threadsDto.channelIdx
            })

            thread.threadIdx = threadListEntity[i].thread_idx

            if (threadListEntity[i].content) {
                thread.content = threadListEntity[i].content
            }

            const threadFile = await this.threadsRepository.getThreadFileList(thread.threadIdx!, this.pool)

            if (threadFile.length !== 0) {
                thread.file = []

                for (let j = 0; j < threadFile.length; j++) {
                    thread.file.push(threadFile[j].file_path)
                }
            }

            thread.authorName = await this.userRepository.getUserNickname(threadListEntity[i].user_idx, this.pool)

            if (threadListEntity[i].user_idx === userDto.userIdx) {
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