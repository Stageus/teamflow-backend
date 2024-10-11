import { Pool } from "pg"
import { TeamSpaceRepository } from "../team-spaces/dao/team-sapces.repo"
import { ChannelRepository } from "./dao/channels.repo"
import { CustomError } from "../../common/exception/customError"
import { UserDto } from "../users/dto/users.dto"
import { ChannelDto } from "./dto/channel.dto"
import { TSMemberEntity } from "../team-spaces/entity/tsMember.entity"
import { ChannelEntity } from "./entity/channel.entity"
import { privateType } from "../../common/const/ch_type"
import { member, teamManager } from "../../common/const/ts_role"
import { ChannelMemberDto } from "./dto/channelMember.dto"
import { ChannelMemberEntity } from "./entity/channelMember.entity"
import { ChMemberDetailDto } from "./dto/channelMemberDetail.dto"
import { TeamSpaceEntity } from "../team-spaces/entity/teamSpace.entity"
import { ChManagerDetailDto } from "./dto/channelManagerDetail.dto"


interface IChannelService {
    createChannel (channelDto: ChannelDto): Promise<void>
    updateChannelName (userDto: UserDto, channelDto: ChannelDto): Promise<void>
    deleteChannel (userDto: UserDto, channelDto: ChannelDto): Promise<void> 
    deleteChannelUser(userDto: UserDto, channelMemberDto: ChannelMemberDto): Promise<void>
    selectChannelUserList(channelMemberDto: ChannelMemberDto): Promise<ChMemberDetailDto[]>
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

        await this.teamSpaceRepository.getTSMemberByIdx(tsMemberEntity, this.pool)

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

    async deleteChannel (userDto: UserDto, channelDto: ChannelDto): Promise<void> {
        const channelEntity = new ChannelEntity({
            channelIdx: channelDto.channelIdx
        })

        await this.channelRepository.getChannelOwner(channelEntity, this.pool)

        if (userDto.userIdx !== channelEntity.ownerIdx) {
            throw this.customError.forbiddenException('해당 channel 소유자만 가능')
        }

        await this.channelRepository.deleteChannel(channelEntity, this.pool)
    }

    async deleteChannelUser(userDto: UserDto, channelMemberDto: ChannelMemberDto): Promise<void> {
        const channelMemberEntity = new ChannelMemberEntity({
            channelIdx: channelMemberDto.channelIdx,
            channelUserIdx: channelMemberDto.channelUserIdx
        })

        const channelEntity = new ChannelEntity({
            channelIdx: channelMemberDto.channelIdx
        })

        await this.channelRepository.getChannelOwner(channelEntity, this.pool)

        if (userDto.userIdx !== channelEntity.ownerIdx) {
            throw this.customError.forbiddenException('해당 channel 소유자만 가능')
        }

        if (channelEntity.ownerIdx === channelMemberEntity.channelUserIdx) {
            throw this.customError.badRequestException('본인은 추방할 수 없음')
        }

        await this.channelRepository.deleteChannelUser(channelMemberEntity, this.pool)
    }

    async selectChannelUserList(channelMemberDto: ChannelMemberDto): Promise<ChMemberDetailDto[]> {
        const channelMemberEntity = new ChannelMemberEntity({
            channelIdx: channelMemberDto.channelIdx
        })

       const userList = await this.channelRepository.getChannelUserList(channelMemberDto.searchWord!, channelMemberEntity, this.pool)

       if (userList.length === 0) {
            throw this.customError.notFoundException('검색된 user가 없음')
       }

       return userList.map(user => new ChMemberDetailDto({
            channelUserIdx: user.channelUserIdx,
            roleIdx: user.roleIdx,
            nickname: user.nickname,
            email: user.email,
            profile: user.profile
       }))
    }

    async updateChannelManager(userDto: UserDto, channelMemberDto: ChannelMemberDto): Promise<void> {
        const channelMemberEntity = new ChannelMemberEntity({
            channelIdx: channelMemberDto.channelIdx,
            channelUserIdx: channelMemberDto.channelUserIdx
        })

        const teamSpaceIdx = await this.channelRepository.getTSByChannelIdx(channelMemberEntity, this.pool)
        const teamSpaceEntity = new TeamSpaceEntity({
            teamSpaceIdx: teamSpaceIdx
        })

        await this.teamSpaceRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manger만 가능')
        }
        
        const tsMemberEntity = new TSMemberEntity({
            teamSpaceIdx: teamSpaceEntity.teamSpaceIdx,
            tsUserIdx: channelMemberEntity.channelUserIdx
        })

        const isChannelUser = await this.channelRepository.getIsChannelUser(channelMemberEntity, this.pool)

        if (!isChannelUser) {
            await this.channelRepository.createChannel(channelMemberEntity, this.pool)
        }

        await this.teamSpaceRepository.getTSMemberByIdx(tsMemberEntity, this.pool)

        if (tsMemberEntity.roleIdx === teamManager) {
            return await this.channelRepository.putChannelManager(teamSpaceEntity, channelMemberEntity, this.pool)
        }

        if (tsMemberEntity.roleIdx === member) {
            await this.teamSpaceRepository.putMemberAuth(tsMemberEntity, this.pool)
            return await this.channelRepository.putChannelManager(teamSpaceEntity, channelMemberEntity, this.pool)
        }
    }

    async selectChannelList(userDto: UserDto, channelDto: ChannelDto): Promise<ChManagerDetailDto[]> {
        const teamSpaceEntity = new TeamSpaceEntity({
            teamSpaceIdx: channelDto.teamSpaceIdx
        })

        const channelEntity = new ChannelEntity({
            teamSpaceIdx: channelDto.teamSpaceIdx,
        })

        await this.teamSpaceRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manager만 가능')
        }

        const channelList = await this.channelRepository.getChannelList(channelDto.searchWord!, channelEntity, this.pool)

        if (channelList.length === 0) {
            throw this.customError.notFoundException('검색된 채널이 없습니다.')
        }

        return channelList.map(channel => new ChManagerDetailDto({
            channelIdx: channel.channelIdx,
            channelName: channel.channelName,
            managerIdx: channel.managerIdx,
            managerNickname: channel.managerNickname
        }))
    }
}