import { Pool } from "pg";
import { TeamSpaceEntity } from "../entity/team-spaces.entity";
import { TSMemberEntity } from "../entity/ts_member.entity";
import { generalManager } from "../../../common/const/ts_role";

interface ITeamSpaceRepository {

}

export interface ITSMemberList {
    userIdx: number,
    roleIdx: number,
    nickname: string,
    email: string,
    profile: string
}

export class TeamSpaceRepository implements ITeamSpaceRepository {
    constructor (
        private readonly pool : Pool
    ) {}

    async addTeamSpace(teamSpaceEntity: TeamSpaceEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query('BEGIN')
        const teamSpaceIdxQueryResult = await conn.query(
            `INSERT INTO team_flow_management.team_space (owner_idx, ts_name) VALUES ($1, $2) RETURNING ts_idx`,
            [teamSpaceEntity.ownerIdx, teamSpaceEntity.teamSpaceName]
        )

        const tsMemberEntity = new TSMemberEntity({
            userIdx: teamSpaceEntity.ownerIdx,
            tsRoleIdx: 1,
            teamSpaceIdx: teamSpaceIdxQueryResult.rows[0].ts_idx
        })

        await conn.query(
            `INSERT INTO team_flow_management.ts_member (user_idx, ts_role_idx, ts_idx) VALUES ($1, $2, $3)`,
            [tsMemberEntity.userIdx, tsMemberEntity.tsRoleIdx, tsMemberEntity.teamSpaceIdx]
        )
        await conn.query('COMMIT')
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

    async getTSMemberList(searchWord: string, tsMemberEntity: TSMemberEntity, conn: Pool = this.pool): Promise<ITSMemberList[]> {
        const tsMemberQueryResult = await conn.query(
            `SELECT ts_member.user_idx, ts_member.ts_role_idx, "user".profile_image, "user".nickname, "user".email
            FROM team_flow_management.ts_member
            JOIN team_flow_management.user ON ts_member.user_idx = "user".user_idx
            WHERE ts_member.ts_idx = $1 AND ts_member.ts_role_idx <> $2 AND "user".nickname LIKE $3
            ORDER BY "user".nickname ASC`,
            [tsMemberEntity.teamSpaceIdx, generalManager, `%${searchWord}%`]
        );

        return tsMemberQueryResult.rows.map((row) => ({
            userIdx: row.user_idx,
            roleIdx: row.ts_role_idx,
            nickname: row.nickname,
            email: row.email,
            profile: row.profile_image
        })) as ITSMemberList[]
    }
}