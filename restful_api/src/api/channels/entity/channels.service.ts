import { Pool } from "pg";
import { ChannelRepository } from "../dao/channels.repo";
import { ChannelDto } from "../dto/channel.dto";
import { TeamSpaceRepository } from "../../team-spaces/dao/team-sapces.repo";
import { TSMemberDto } from "../../team-spaces/dto/tsMember.dto";
import { teamManager } from "../../../common/const/ts_role";
import { CustomError } from "../../../common/exception/customError";
import { ChannelEntity } from "./channel.entity";
import { privateType } from "../../../common/const/ch_type";
import { TSMemberEntity } from "../../team-spaces/entity/tsMember.entity";
import { UserDto } from "../../users/dto/users.dto";

interface IChannelService {
    createChannel (channelDto: ChannelDto): Promise<void>
}

export class ChannelService implements IChannelService {
    private customError: CustomError

    constructor(
        private readonly teamSpaceRepository : TeamSpaceRepository,
        private readonly channelRepository : ChannelRepository,
        private readonly pool : Pool
    ) {
        this.customError = new CustomError()
    }

    async createChannel (channelDto: ChannelDto): Promise<void> {
        const tsMemberEntity = new TSMemberEntity({
            teamSpaceIdx: channelDto.teamSpaceIdx,
            tsUserIdx: channelDto.ownerIdx
        })

        const channelEntity = new ChannelEntity({
            teamSpaceIdx: channelDto.teamSpaceIdx,
            ownerIdx: channelDto.ownerIdx,
            chTypeIdx: privateType,
            channelName: channelDto.channelName
        })

        const roleIdx = await this.teamSpaceRepository.getTSMemberByIdx(tsMemberEntity, this.pool)

        if (tsMemberEntity.roleIdx !== teamManager) {
            throw this.customError.forbiddenException('team manager만 가능')
        }

        await this.channelRepository.createChannel(channelEntity, this.pool)
    }

    async updateChannelName (userDto: UserDto, channelDto: ChannelDto): Promise<void> {
        const channelEntity = new ChannelEntity({
            channelIdx: channelDto.channelIdx,
            channelName: channelDto.channelName
        })

        await this.channelRepository.getChannelOwner(channelEntity, this.pool)

        if (userDto.userIdx !== channelEntity.ownerIdx) {
            throw this.customError.forbiddenException('해당 channel 소유자만 가능')
        }

        await this.channelRepository.putChannelName(channelEntity, this.pool)
    }
}