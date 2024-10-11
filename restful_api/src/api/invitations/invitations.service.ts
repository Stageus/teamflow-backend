import { Pool } from "pg";
import { CustomError } from "../../common/exception/customError";
import { InvitationRepository } from "./dao/invitations.repo";
import { UserDto } from "../users/dto/users.dto";
import { TSInvitationDto } from "./dto/tsInvitation.dto";
import { TeamSpaceEntity } from "../team-spaces/entity/teamSpace.entity";
import { TeamSpaceRepository } from "../team-spaces/dao/team-sapces.repo";
import { UserEntity } from "../users/entity/users.entity";
import { UserRepository } from "../users/dao/users.repo";
import { sendInvitatedEmail } from "../../common/utils/sendInvitedMail";

interface IInvitationService{

}

export class InvitationService implements IInvitationService {
    private customError: CustomError

    constructor(
        private readonly invitationRepository: InvitationRepository,
        private readonly teamSpacaeRepository: TeamSpaceRepository,
        private readonly userRepository: UserRepository,
        private readonly pool: Pool
    ) {
        this.customError = new CustomError()
    }

    async createTSInvited(userDto: UserDto, tsInvitationDto: TSInvitationDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity({
            teamSpaceIdx: tsInvitationDto.teamSpaceIdx
        })

        await this.teamSpacaeRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manger만 가능')
        }

        await this.teamSpacaeRepository.getTSNameByIdx(teamSpaceEntity, this.pool)

        const userEntity = new UserEntity({
            userIdx: userDto.userIdx,
        })

        await this.userRepository.getUserProfile(userEntity, this.pool)

        tsInvitationDto.sendEmail = userEntity.email
        tsInvitationDto.sendNickname = userEntity.nickname
        tsInvitationDto.teamSpaceName = teamSpaceEntity.teamSpaceName

        await sendInvitatedEmail(tsInvitationDto)
    }
}