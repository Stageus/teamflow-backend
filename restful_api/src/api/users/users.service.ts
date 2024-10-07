import { Pool } from "pg";
import { UserDto } from "./dto/users.dto";
import { UserRepository } from "./dao/users.repo";
import { UserEntity } from "./entity/users.entity";

interface IUserService {
    selectUserByEmail(userDto: UserDto): Promise<void>
    createUser(userDto: UserDto): Promise<void>
}

export class UserService implements IUserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly pool: Pool
    ) {}

    async selectUserByEmail(userDto: UserDto): Promise<void> {
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

    async selectUserInfo(userDto: UserDto): Promise<void> {
        const userEntity = new UserEntity({
            userIdx: userDto.userIdx
        })

        await this.userRepository.getUserProfile(userEntity, this.pool)
        await this.userRepository.getUserTSCount(userDto, userEntity, this.pool)

        userDto.nickname = userEntity.nickname
        userDto.email = userEntity.email
        userDto.profile = userEntity.profile
    }

    async updateProfileImage(userDto: UserDto) {
        const userEntity = new UserEntity({
            userIdx: userDto.userIdx,
            profile: userDto.profile
        })

        await this.userRepository.putProfileImage(userEntity, this.pool)
    }

    async updateNickname(userDto: UserDto) {
        const userEntity = new UserEntity({
            userIdx: userDto.userIdx,
            nickname: userDto.nickname
        })

        await this.userRepository.putNickname(userEntity, this.pool)
    }
}