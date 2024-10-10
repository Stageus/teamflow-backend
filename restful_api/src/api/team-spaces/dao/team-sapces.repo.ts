import { Pool } from "pg";
import { TeamSpaceEntity } from "../entity/teamSpace.entity";
import { TSMemberEntity } from "../entity/tsMember.entity";
import { generalManager, member, teamManager } from "../../../common/const/ts_role";
import { TSMemberDetailEntity } from "../entity/tsMemberDetail.entity";
import { notificationType, privateType, publicType } from "../../../common/const/ch_type";
import { TSParListDetailEntity } from "../entity/tsParListDetail.entity";

interface ITeamSpaceRepository {
    addTeamSpace(teamSpaceEntity: TeamSpaceEntity, conn: Pool): Promise<void>
    getTeamSpaceOwner(teamSpaceEntity: TeamSpaceEntity, conn: Pool): Promise<void>
    putTeamSpaceName(teamSpaceEntity: TeamSpaceEntity, conn: Pool): Promise<void>
    deleteTeamSpace(teamSpaceEntity: TeamSpaceEntity, conn: Pool): Promise<void>
    getTSMemberList(searchWord: string, tsMemberEntity: TSMemberEntity, conn: Pool): Promise<TSMemberDetailEntity[]> 
    getTSMemberByIdx(tsMemberEntity: TSMemberEntity, conn: Pool): Promise<TSMemberEntity>
    putManagerAuth(tsMemberEntity: TSMemberEntity, conn: Pool): Promise<void> 
    putMemberAuth(tsMemberEntity: TSMemberEntity, conn: Pool): Promise<void>
    deleteManager(tsMemberEntity: TSMemberEntity, conn: Pool): Promise<void>
    deleteMember(tsMemberEntity: TSMemberEntity, conn: Pool): Promise<void>
    getTSList(tsMemberEntity: TSMemberEntity, conn: Pool): Promise<TSMemberEntity[]>
    getTSOwnList(page: number, teamSpaceEntity: TeamSpaceEntity, conn: Pool): Promise<TSMemberEntity[]>
    getTSParList(page: number, tsMemberEntity: TSMemberEntity, conn: Pool): Promise<TSParListDetailEntity[]>
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
            tsUserIdx: teamSpaceEntity.ownerIdx,
            roleIdx: 1,
            teamSpaceIdx: teamSpaceIdxQueryResult.rows[0].ts_idx
        })

        await conn.query(
            `INSERT INTO team_flow_management.ts_member (user_idx, ts_role_idx, ts_idx) VALUES ($1, $2, $3)`,
            [tsMemberEntity.tsUserIdx, tsMemberEntity.roleIdx, tsMemberEntity.teamSpaceIdx]
        )
        await conn.query(
            `INSERT INTO team_flow_management.channel (ts_idx, ch_type_idx, owner_idx, ch_name) VALUES ($1, $2, $3, $4)`,
            [tsMemberEntity.teamSpaceIdx, notificationType, tsMemberEntity.tsUserIdx, "공지채널" ]
        )
        await conn.query(
            `INSERT INTO team_flow_management.channel (ts_idx, ch_type_idx, owner_idx, ch_name) VALUES ($1, $2, $3, $4)`,
            [tsMemberEntity.teamSpaceIdx, publicType, tsMemberEntity.tsUserIdx, "공개채널" ]
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

    async getTSMemberList(searchWord: string, tsMemberEntity: TSMemberEntity, conn: Pool = this.pool): Promise<TSMemberDetailEntity[]> {
        const tsMemberQueryResult = await conn.query(
            `SELECT ts_member.user_idx, ts_member.ts_role_idx, "user".profile_image, "user".nickname, "user".email
            FROM team_flow_management.ts_member
            JOIN team_flow_management.user ON ts_member.user_idx = "user".user_idx
            WHERE ts_member.ts_idx = $1 AND ts_member.ts_role_idx <> $2 AND "user".nickname LIKE $3
            ORDER BY "user".nickname ASC`,
            [tsMemberEntity.teamSpaceIdx, generalManager, `%${searchWord}%`]
        );

        return tsMemberQueryResult.rows.map(row => new TSMemberDetailEntity({
            tsUserIdx: row.user_idx,
            roleIdx: row.ts_role_idx,
            nickname: row.nickname,
            email: row.email,
            profile: row.profile_image
        }))
    }

    async getTSMemberByIdx(tsMemberEntity: TSMemberEntity, conn: Pool = this.pool): Promise<TSMemberEntity> {
        const tsMemberQueryResult = await conn.query(
            `SELECT ts_role_idx FROM team_flow_management.ts_member WHERE ts_idx = $1 AND user_idx = $2`,
            [tsMemberEntity.teamSpaceIdx, tsMemberEntity.tsUserIdx]
        )

        if (tsMemberQueryResult.rows[0]) {
            tsMemberEntity.roleIdx = tsMemberQueryResult.rows[0].ts_role_idx
        }

        return tsMemberEntity
    }

    async putManagerAuth(tsMemberEntity: TSMemberEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query('BEGIN')
        await conn.query(
            `UPDATE team_flow_management.ts_member SET ts_role_idx=$1 WHERE ts_idx=$2 AND user_idx=$3`,
            [member, tsMemberEntity.teamSpaceIdx, tsMemberEntity.tsUserIdx]
        )
        await conn.query(
            `UPDATE team_flow_management.channel SET owner_idx=null WHERE ts_idx = $1 AND owner_idx = $2`,
            [tsMemberEntity.teamSpaceIdx, tsMemberEntity.tsUserIdx]
        )
        await conn.query('COMMIT')
    }

    async putMemberAuth(tsMemberEntity: TSMemberEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `UPDATE team_flow_management.ts_member SET ts_role_idx=$1 WHERE ts_idx = $2 AND user_idx = $3`,
            [teamManager, tsMemberEntity.teamSpaceIdx, tsMemberEntity.tsUserIdx]
        )
    }

    async deleteManager(tsMemberEntity: TSMemberEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query('BEGIN')
        await conn.query(
            `DELETE FROM team_flow_management.ts_member WHERE ts_idx=$1 AND user_idx=$2`,
            [tsMemberEntity.teamSpaceIdx, tsMemberEntity.tsUserIdx]
        )
        await conn.query(
            `UPDATE team_flow_management.channel WHERE ts_idx=$1 AND owner_idx=$2`,
            [tsMemberEntity.teamSpaceIdx, tsMemberEntity.tsUserIdx]
        )
        await conn.query(
            `DELETE FROM team_flow_management.private_ch_member 
            WHERE ch_idx IN (SELECT ch_idx FROM team_flow_management.channel WHERE ts_idx=$1 AND ch_type_idx=$2)
            AND user_idx=$3`,
            [tsMemberEntity.teamSpaceIdx, privateType, tsMemberEntity.tsUserIdx]
        )
        await conn.query(
            `UPDATE team_flow_management.thread SET user_idx=null
            WHERE thread.ch_idx IN (SELECT ch_idx FROM team_flow_management.channel WHERE ts_idx=$1 AND ch_type_idx=$2)
            AND user_idx = $3`
        )
        await conn.query('COMMIT')
    }

    async deleteMember(tsMemberEntity: TSMemberEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query('BEGIN')
        await conn.query(
            `DELETE FROM team_flow_management.ts_member WHERE ts_idx=$1 AND user_idx=$2`,
            [tsMemberEntity.teamSpaceIdx, tsMemberEntity.tsUserIdx]
        )
        await conn.query(
            `DELETE FROM team_flow_management.private_ch_member 
            WHERE ch_idx IN (SELECT ch_idx FROM team_flow_management.channel WHERE ts_idx=$1 AND ch_type_idx=$2)
            AND user_idx=$3`,
            [tsMemberEntity.teamSpaceIdx, privateType, tsMemberEntity.tsUserIdx]
        )
        await conn.query(
            `UPDATE team_flow_management.thread SET user_idx=null
            WHERE thread.ch_idx IN (SELECT ch_idx FROM team_flow_management.channel WHERE ts_idx=$1 AND ch_type_idx=$2)
            AND user_idx = $3`,
            [tsMemberEntity.teamSpaceIdx, privateType, tsMemberEntity.tsUserIdx]
        )
        await conn.query('COMMIT')
    }

    async getTSList(tsMemberEntity: TSMemberEntity, conn: Pool = this.pool): Promise<TSMemberEntity[]> {
        const tsListQueryResult = await conn.query(
            `SELECT ts_member.ts_idx, ts_member.ts_role_idx, "team_space".ts_name 
            FROM team_flow_management.ts_member
            JOIN team_flow_management.team_space ON ts_member.ts_idx="team_space".ts_idx
            WHERE ts_member.user_idx=$1 ORDER BY ts_member.joined_at DESC`,
            [tsMemberEntity.tsUserIdx]
        )
        
        return tsListQueryResult.rows.map(row => new TSMemberEntity({
            teamSpaceIdx: row.ts_idx,
            teamSpaceName: row.ts_name,
            roleIdx: row.ts_role_idx
        }))
    }

    async getTSOwnList(page: number, teamSpaceEntity: TeamSpaceEntity, conn: Pool = this.pool): Promise<TSMemberEntity[]> {
        const tsOwnListQueryResult = await conn.query(
            `SELECT ts_idx, ts_name FROM team_flow_management.team_space 
            WHERE owner_idx=$1
            ORDER BY created_at DESC
            OFFSET $2 FETCH NEXT 6 ROWS ONLY`,
            [teamSpaceEntity.ownerIdx, page * 6]
        )
        

        return tsOwnListQueryResult.rows.map(row => new TSMemberEntity({
            teamSpaceIdx: row.ts_idx,
            teamSpaceName: row.ts_name,
            roleIdx: generalManager
        }))
    }

    async getTSParList(page: number, tsMemberEntity: TSMemberEntity, conn: Pool = this.pool): Promise<TSParListDetailEntity[]> {
        const tsParListQueryResult = await conn.query(
            `SELECT ts_member.ts_idx, ts_member.ts_role_idx, "team_space".ts_name, "user".nickname, "user".email
            FROM team_flow_management.ts_member 
            JOIN team_flow_management."team_space" ON ts_member.ts_idx = "team_space".ts_idx
            JOIN team_flow_management."user" ON "team_space".owner_idx = "user".user_idx
            WHERE ts_member.user_idx = $1 AND ts_role_idx != $2
            ORDER BY ts_member.joined_at DESC
            OFFSET $2 FETCH NEXT 6 ROWS ONLY`,
            [tsMemberEntity.tsUserIdx, generalManager, page * 6]
        )

        return tsParListQueryResult.rows.map(row => new TSParListDetailEntity({
            teamSpaceIdx: row.ts_idx,
            teamSpaceName: row.ts_name,
            roleIdx: row.ts_role_idx,
            generalManagerNickname: row.nickname,
            generalManagerEmail: row.email
        }))
    }
}