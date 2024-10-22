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

        // channel 소속 유저가 아닌 경우
        if (!isChannelUser) {
            throw this.customError.forbiddenException('channel 소속 user가 아님')
        }

        const threadListEntity = await this.threadsRepository.getThreadList(threadsEntity, this.pool)

        // 작성한 쓰레드가 없는 경우
        if (threadListEntity.length === 0) {
            throw this.customError.notFoundException('thread가 없음')
        }

        const threadList: ThreadsDto[] = []
        
        for(let i = 0; i < threadListEntity.length; i++) {
            const thread = new ThreadsDto({
                channelIdx: threadsDto.channelIdx
            })

            // 쓰레드의 내용 작성이 있는 경우
            if (threadListEntity[i].content) {
                thread.content = threadListEntity[i].content
            }

            const threadFile = await this.threadsRepository.getThreadFileList(thread.threadIdx!, this.pool)

            // thread의 파일이 있는 경우
            if (threadFile.length !== 0) {
                thread.file = []

                for (let j = 0; j < threadFile.length; j++) {
                    thread.file.push(threadFile[j].file_path)
                }
            }

            // 로그인한 user와 작성자의 일치 여부
            if (threadListEntity[i].user_idx === userDto.userIdx) {
                thread.isAuthor = true
            } else {
                thread.isAuthor = false
            }

            thread.authorName = await this.userRepository.getUserNickname(threadListEntity[i].user_idx, this.pool)
            thread.threadIdx = threadListEntity[i].thread_idx
            thread.createdAt = threadListEntity[i].createdAt
            thread.isUpdated = threadListEntity[i].isUpdated
            thread.isMention = threadListEntity[i].isMention

            threadList.push(thread)
        }

        return threadList
    }
}