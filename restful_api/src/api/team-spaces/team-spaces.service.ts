import { Pool } from "pg";
import { TeamSpaceRepository } from "./dao/team-sapces.repo";
import { TeamSpaceDto } from "./dto/team-spaes.dto";
import { TeamSpaceEntity } from "./entity/team-spaces.entity";
import { UserDto } from "../users/dto/users.dto";
import { CustomError } from "../../common/exception/customError";

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
}