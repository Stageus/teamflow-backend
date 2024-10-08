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

    async getTeamSpaceOwner(teamSpaceEntity: TeamSpaceEntity, conn: Pool = this.pool): Promise<void> {
        const ownerQueryResult = await conn.query(
            `SELECT owner_idx FROM team_flow_management.team_space WHERE ts_idx=$1`,
            [teamSpaceEntity.teamSpaceIdx]
        )

        teamSpaceEntity.ownerIdx = ownerQueryResult.rows[0].owner_idx
    }

    async putTeamSpaceName(teamSpaceEntity: TeamSpaceEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `UPDATE team_flow_management.team_space SET ts_name=$1 WHERE ts_idx=$2`,
            [teamSpaceEntity.teamSpaceName, teamSpaceEntity.teamSpaceIdx]
        )
    }

    async deleteTeamSpace(teamSpaceEntity: TeamSpaceEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `DELETE FROM team_flow_management.team_space WHERE ts_idx=$1`,
            [teamSpaceEntity.teamSpaceIdx]
        )
    }
}