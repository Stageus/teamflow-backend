import { Pool } from "pg";
import { UserDto } from "../dto/users.dto";

interface IUserRepository {

}

export class UserRepository implements IUserRepository {
    constructor(private readonly pool: Pool) {}

    async selectUserByEmail(userDto: UserDto, conn: Pool = this.pool): Promise<void> {
        const isUserResult = await conn.query(
            `SELECT user_idx FROM team_flow_management.user WHERE email = $1`,
            [userDto.email]
        )

        userDto.userIdx = isUserResult.rows[0]
    }
}