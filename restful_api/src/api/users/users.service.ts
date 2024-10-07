import { Pool } from "pg";
import { UserDto } from "./dto/users.dto";
import { UserRepository } from "./dao/users.repo";

interface IUserService {
    selectUser(userDto: UserDto): Promise<void>
}

export class UserService implements IUserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly pool: Pool
    ) {}

    async selectUser(userDto: UserDto): Promise<void> {
        await this.userRepository.selectUserByEmail(userDto, this.pool)
    }
}