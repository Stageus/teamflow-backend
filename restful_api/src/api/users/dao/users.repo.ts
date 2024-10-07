import { Pool } from "pg";
import { UserDto } from "../dto/users.dto";
import { UserEntity } from "../entity/users.entity";

interface IUserRepository {
    findUserByEmail(userEntity: UserEntity, conn: Pool): Promise<void>
    signUp(userEntity: UserEntity, conn: Pool): Promise<void>
    getUserProfile(userEntity: UserEntity, conn: Pool): Promise<void>
}

export class UserRepository implements IUserRepository {
    constructor(private readonly pool: Pool) {}

    async findUserByEmail(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        const isUserQueryResult = await conn.query(
            `SELECT user_idx FROM team_flow_management.user WHERE email = $1`,
            [userEntity.email]
        )

        if (isUserQueryResult) {
            userEntity.userIdx = isUserQueryResult.rows[0].user_idx
        }
    }

    async signUp(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            'INSERT INTO team_flow_management.user (nickname, email, profile_image) VALUES ($1, $2, $3)',
            [userEntity.nickname, userEntity.email, userEntity.profile]
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

    async getUserTSCount(userDto: UserDto, userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        const userOwnTSQueryResult = await conn.query(
            `SELECT COUNT(*) FROM team_flow_management.team_space WHERE owner_idx=$1 GROUP BY owner_idx`,
            [userEntity.userIdx]
        )

        const userTSQueryResult = await conn.query(
            `SELECT COUNT(*) FROM team_flow_management.ts_member WHERE user_idx=$1 GROUP BY user_idx`,
            [userEntity.userIdx]
        )

        userDto.teamSpaceOwnCount = userOwnTSQueryResult.rows[0].COUNT
        userDto.teamSpaceCount = userTSQueryResult.rows[0].COUNT
    }
}