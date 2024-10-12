import { Pool } from "pg";
import { CustomError } from "../../common/custom/customError";
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

interface IInvitationService{
    createTSInvited(userDto: UserDto, tsInvitationDto: TSInvitationDto): Promise<void>
}

export class InvitationService implements IInvitationService {
    private customError: CustomError

    constructor(
        private readonly invitationRepository: InvitationRepository,
        private readonly teamSpacaeRepository: TeamSpaceRepository,
        private readonly userRepository: UserRepository,
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

        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manger만 가능')
        }

        await this.invitationRepository.getIsInvited(tsInvitationEntity, this.pool)

        if (tsInvitationEntity.invitedAt) {
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
}