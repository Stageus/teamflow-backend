import { Pool } from "pg";
import { CustomError } from "../../common/exception/customError";
import { InvitationRepository } from "./dao/invitations.repo";
import { UserDto } from "../users/dto/users.dto";
import { TSInvitationDto } from "./dto/tsInvitation.dto";
import { TeamSpaceEntity } from "../team-spaces/entity/teamSpace.entity";
import { TeamSpaceRepository } from "../team-spaces/dao/team-sapces.repo";
import { UserEntity } from "../users/entity/users.entity";
import { UserRepository } from "../users/dao/users.repo";
import { SendMail } from "../../common/utils/sendMail";
import { TSInvitationEntity } from "./entity/tsInvitation.entity";
import { MongoClient } from "mongodb";
import { ChInvitationDto } from "./dto/chInvitation.dto";
import { ChannelRepository } from "../channels/dao/channels.repo";
import { ChannelEntity } from "../channels/entity/channel.entity";
import { ChInvitationEntity } from "./entity/chInvitation.entity";

interface IInvitationService{
    createTSInvited(userDto: UserDto, tsInvitationDto: TSInvitationDto): Promise<void>
    createChannelInvitation(userDto: UserDto, chInviationDto: ChInvitationDto): Promise<void>
}

export class InvitationService implements IInvitationService {
    private customError: CustomError

    constructor(
        private readonly invitationRepository: InvitationRepository,
        private readonly teamSpacaeRepository: TeamSpaceRepository,
        private readonly userRepository: UserRepository,
        private readonly channelRepository: ChannelRepository,
        private readonly pool: Pool,
        private readonly client: MongoClient
    ) {
        this.customError = new CustomError()
    }

    async createTSInvited(userDto: UserDto, tsInvitationDto: TSInvitationDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity({
            teamSpaceIdx: tsInvitationDto.teamSpaceIdx
        })

         const tsInvitationEntity = new TSInvitationEntity({
            teamSpaceIdx: tsInvitationDto.teamSpaceIdx,
            email: tsInvitationDto.toEmail
        })

        await this.teamSpacaeRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        // teamSpace의 general manager가 아닌 경우
        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manger만 가능')
        }

        await this.invitationRepository.getIsTSInvited(tsInvitationEntity, this.pool)

        // 이미 초대된 유저인지 여부
        if (tsInvitationEntity.invitedAt) {
            // 초대 시간에 따른 재발송
            if (new Date().getTime() - tsInvitationEntity.invitedAt.getTime() <= 24 * 60 * 60 * 1000 * 7 ) {
                throw this.customError.conflictException('이미 초대된 user')
            }

            await this.invitationRepository.deleteTsInvited(tsInvitationEntity, this.pool)
        }

        await this.teamSpacaeRepository.getTSNameByIdx(teamSpaceEntity, this.pool)

        const userEntity = new UserEntity({
            userIdx: userDto.userIdx,
        })

        await this.userRepository.getUserProfile(userEntity, this.pool)

        tsInvitationDto.sendEmail = userEntity.email
        tsInvitationDto.sendNickname = userEntity.nickname
        tsInvitationDto.teamSpaceName = teamSpaceEntity.teamSpaceName

        await new SendMail().sendInvitatedEmail(tsInvitationDto)

        await this.invitationRepository.addTSInvited(userEntity, tsInvitationEntity, this.pool, this.client)
    }

    async createChannelInvitation(userDto: UserDto, chInviationDto: ChInvitationDto): Promise<void> {
        const channelEntity = new ChannelEntity({
            channelIdx: chInviationDto.channelIdx
        })

        const chInvitationEntity = new ChInvitationEntity({
            channelIdx: chInviationDto.channelIdx,
            userIdx: chInviationDto.userIdx
        })

        const userEntity = new UserEntity({
            userIdx: userDto.userIdx
        })

        await this.channelRepository.getChannelOwner(channelEntity, this.pool)

        // channel manager인지 여부
        if (userDto.userIdx !== channelEntity.ownerIdx) {
            throw this.customError.forbiddenException('channel manager만 가능')
        }

        await this.invitationRepository.getIsChannelInvited(chInvitationEntity, this.pool)

        // channel 초대 여부 확인
        if (chInvitationEntity.invitedAt) {
            // channel 초대 시간에 따른 재발송 여부
            if (new Date().getTime() - chInvitationEntity.invitedAt.getTime() <= 24 * 60 * 60 * 1000 * 7 ) {
                throw this.customError.conflictException('이미 초대된 user')
            }

            await this.invitationRepository.deleteChannelInvited(chInvitationEntity, this.pool)
        }

        await this.invitationRepository.addChannelInvited(userEntity, chInvitationEntity, this.pool, this.client)
    }
}