import { Pool } from "pg";
import { UserEntity } from "../entity/users.entity";
import { privateType } from "../../../common/const/ch_type";

interface IUserRepository {
    findUserByEmail(userEntity: UserEntity, conn: Pool): Promise<void>
    signUp(userEntity: UserEntity, conn: Pool): Promise<void>
    reSignUp(userEntity: UserEntity, conn: Pool): Promise<void>
    getUserProfile(userEntity: UserEntity, conn: Pool): Promise<void>
    getUserTSCount(userEntity: UserEntity, conn: Pool): Promise<{}>
    putProfileImage(userEntity: UserEntity, conn: Pool): Promise<void>
    putNickname(userEntity: UserEntity, conn: Pool): Promise<void>
    withdrawal(userEntity: UserEntity, conn: Pool): Promise<void> 
    getUserEmail(userEntity: UserEntity, conn: Pool): Promise<void>
}

interface ITSCount {
    userOwnTsCount: number,
    userTsCount: number
}

export class UserRepository implements IUserRepository {
    constructor(private readonly pool: Pool) {}

    async findUserByEmail(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        const isUserQueryResult = await conn.query(
            `SELECT user_idx, is_deleted FROM team_flow_management.user WHERE email = $1`,
            [userEntity.email]
        )

        if (isUserQueryResult.rows[0]) {
            userEntity.userIdx = isUserQueryResult.rows[0].user_idx
            userEntity.isDeleted = isUserQueryResult.rows[0].is_deleted
        }
    }

    async signUp(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            'INSERT INTO team_flow_management.user (nickname, email, profile_image) VALUES ($1, $2, $3)',
            [userEntity.nickname, userEntity.email, userEntity.profile]
        )
    }

    async reSignUp(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `UPDATE team_flow_management.user SET nickname=$1, profile_image=$2, is_deleted=false WHERE user_idx=$3`,
            [userEntity.nickname, userEntity.profile, userEntity.userIdx]
        )
    }

    async getUserProfile(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        const userInfoQueryResult = await conn.query(
            `SELECT nickname, email, profile_image FROM team_flow_management.user WHERE user_idx=$1`,
            [userEntity.userIdx]
        )

        userEntity.nickname = userInfoQueryResult.rows[0].nickname
        userEntity.email = userInfoQueryResult.rows[0].email
        userEntity.profile = userInfoQueryResult.rows[0].profile_image
    }

    async getUserTSCount(userEntity: UserEntity, conn: Pool = this.pool): Promise<ITSCount> {
        await conn.query('BEGIN') 
       
        const userOwnTSQueryResult = await conn.query(
            `SELECT COUNT(*) as count FROM team_flow_management.team_space WHERE owner_idx=$1 GROUP BY owner_idx`,
            [userEntity.userIdx]
        )

        const userTSQueryResult = await conn.query(
            `SELECT COUNT(*) as count FROM team_flow_management.ts_member WHERE user_idx=$1 GROUP BY user_idx`,
            [userEntity.userIdx]
        )

        await conn.query('COMMIT')

        const tsCount = {
            userOwnTsCount: userOwnTSQueryResult.rows[0]? parseInt(userOwnTSQueryResult.rows[0].count) : 0,
            userTsCount: userTSQueryResult.rows[0]? parseInt(userTSQueryResult.rows[0].count) : 0
        }

        return tsCount
    }

    async putProfileImage(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `UPDATE team_flow_management.user SET profile_image=$1 WHERE user_idx=$2`,
            [userEntity.profile, userEntity.userIdx]
        )
    }

    async putNickname(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            `UPDATE team_flow_management.user SET nickname=$1 WHERE user_idx=$2`,
            [userEntity.nickname, userEntity.userIdx]
        )
    }

    async withdrawal(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(`BEGIN`)
        await conn.query(
            `UPDATE team_flow_management.user SET is_deleted=true WHERE user_idx=$1`,
            [userEntity.userIdx]
        )
        await conn.query(
            `DELETE FROM team_flow_management.team_space WHERE owner_idx=$1`,
            [userEntity.userIdx]
        )
        await conn.query(
            `DELETE FROM team_flow_management.ts_member WHERE user_idx=$1`,
            [userEntity.userIdx]
        )
        await conn.query(
            `UPDATE team_flow_management.channel SET owner_idx=null WHERE owner_idx=$1 AND ch_type_idx=$2`,
            [userEntity.userIdx, privateType]
        )
        await conn.query(
            `DELETE FROM team_flow_management.private_ch_member WHERE user_idx=$1`,
            [userEntity.userIdx]
        )
        await conn.query(
            `DELETE FROM team_flow_management.private_ch_invitation WHERE user_idx=$1`,
            [userEntity.userIdx]
        )
        await conn.query(
            `UPDATE team_flow_management.thread SET user_idx=null WHERE user_idx=$1`,
            [userEntity.userIdx]
        )
        await conn.query(`COMMIT`)
    }

    async getUserEmail(userEntity: UserEntity, conn: Pool): Promise<void> {
        const emailQueryResult = await conn.query(
            `SELECT email FROM team_flow_management.user WHERE user_idx=$1`,
            [userEntity.userIdx]
        )

        if (emailQueryResult.rows.length !== 0) {
            userEntity.email = emailQueryResult.rows[0].email
        }
    }

    async getUserNickname(userIdx: number, conn: Pool): Promise<string> {
        const emailQueryResult = await conn.query(
            `SELECT nickname FROM team_flow_management.user WHERE user_idx=$1`,
            [userIdx]
        )

        return emailQueryResult.rows[0].nickname
    }
}