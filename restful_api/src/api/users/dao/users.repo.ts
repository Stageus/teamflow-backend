import { Pool } from "pg";
import { UserDto } from "../dto/users.dto";
import { UserEntity } from "../entity/users.entity";

interface IUserRepository {
    findUserByEmail(userEntity: UserEntity, conn: Pool): Promise<void>
    signUp(userEntity: UserEntity, conn: Pool): Promise<void>
}

export class UserRepository implements IUserRepository {
    constructor(private readonly pool: Pool) {}

    async findUserByEmail(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        const isUserResult = await conn.query(
            `SELECT user_idx FROM team_flow_management.user WHERE email = $1`,
            [userEntity.email]
        )

        if (isUserResult) {
            userEntity.userIdx = isUserResult.rows[0].user_idx
        }
    }

    async signUp(userEntity: UserEntity, conn: Pool = this.pool): Promise<void> {
        await conn.query(
            'INSERT INTO team_flow_management.user (nickname, email, profile_image) VALUES ($1, $2, $3)',
            [userEntity.nickname, userEntity.email, userEntity.profile]
        )
    }
}