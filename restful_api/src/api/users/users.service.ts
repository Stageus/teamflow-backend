import { Pool } from "pg";
import { UserDto } from "./dto/users.dto";
import { UserRepository } from "./dao/users.repo";
import { UserEntity } from "./entity/users.entity";

interface IUserService {
    selectUser(userDto: UserDto): Promise<void>
}

export class UserService implements IUserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly pool: Pool
    ) {}

    async selectUser(userDto: UserDto): Promise<void> {
        const userEntity = new UserEntity({
            email: userDto.email
        })

        await this.userRepository.findUserByEmail(userEntity, this.pool)

        if (userEntity.userIdx) {
            userDto.userIdx = userEntity.userIdx
        } 
    }

    async createUser(userDto: UserDto): Promise<void> {
        const userEntity = new UserEntity({
            nickname: userDto.nickname,
            email: userDto.email,
            profile: userDto.profile
        })

        await this.userRepository.signUp(userEntity, this.pool)
    }
}