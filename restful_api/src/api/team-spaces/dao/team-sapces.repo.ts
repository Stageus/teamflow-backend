import { Pool } from "pg";
import { TeamSpaceEntity } from "../entity/team-spaces.entity";

interface ITeamSpaceRepository {

}

export class TeamSpaceRepository implements ITeamSpaceRepository {
    constructor (
        private readonly pool : Pool
    ) {}

    async addTeamSpace(teamSpaceEntity: TeamSpaceEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `INSERT INTO team_flow_management.team_space (owner_idx, ts_name) VALUES ($1, $2)`,
            [teamSpaceEntity.ownerIdx, teamSpaceEntity.teamSpaceName]
        )
    }
}