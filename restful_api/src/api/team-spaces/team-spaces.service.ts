import { Pool } from "pg";
import { ITSMemberList, TeamSpaceRepository } from "./dao/team-sapces.repo";
import { TeamSpaceDto } from "./dto/team-spaes.dto";
import { TeamSpaceEntity } from "./entity/team-spaces.entity";
import { UserDto } from "../users/dto/users.dto";
import { CustomError } from "../../common/exception/customError";
import { TSMemberEntity } from "./entity/ts_member.entity";
import { TSMemberDto } from "./dto/ts_member.dto";

interface ITeamSpaceService {

}

export class TeamSpaceService {
    private customError: CustomError

    constructor (
        private readonly teamSpaceRepository : TeamSpaceRepository,
        private readonly pool : Pool
    ) {
        this.customError = new CustomError()
    }

    async createTeamSpace(teamSpaceDto: TeamSpaceDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity({
            ownerIdx: teamSpaceDto.ownerIdx,
            teamSpaceName: teamSpaceDto.teamSpaceName
        })

        await this.teamSpaceRepository.addTeamSpace(teamSpaceEntity, this.pool) 
    }

    async updateTeamSpace(userDto: UserDto, teamSpaceDto: TeamSpaceDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity({
            teamSpaceIdx: teamSpaceDto.teamSpaceIdx,
            teamSpaceName: teamSpaceDto.teamSpaceName
        })

        await this.teamSpaceRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manager만 가능')
        }

        await this.teamSpaceRepository.putTeamSpaceName(teamSpaceEntity, this.pool)
    }

    async deleteTeamSpace(userDto: UserDto, teamSpaceDto: TeamSpaceDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity({
            teamSpaceIdx: teamSpaceDto.teamSpaceIdx
        })

        await this.teamSpaceRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manager만 가능')
        }

        await this.teamSpaceRepository.deleteTeamSpace(teamSpaceEntity, this.pool)
    }

    async selectUserList(tsMemberDto: TSMemberDto): Promise<ITSMemberList[]> {
        const tsMemberEntity = new TSMemberEntity({
            teamSpaceIdx: tsMemberDto.teamSpaceIdx
        })

        return await this.teamSpaceRepository.getTSMemberList(tsMemberDto.searchWord!, tsMemberEntity, this.pool)
    }
}