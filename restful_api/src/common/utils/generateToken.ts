import jwt from 'jsonwebtoken'
import { jwtAccessSecretKey, jwtRefreshSecretKey } from '../const/environment'
import { UserDto } from '../../api/users/dto/users.dto'

export function generateSignUpToken(userDto: UserDto) {
    return jwt.sign(
        {
            email: userDto.email,
            profile: userDto.profile
        },
        jwtAccessSecretKey,
        {
            issuer: "choiminseo",
            expiresIn: "30m"
        }
    )
}

export function generateAccessToken(userDto: UserDto) {
    return jwt.sign(
        {
            user_idx: userDto.userIdx
        },
        jwtAccessSecretKey,
        {
            issuer: "choiminseo",
            expiresIn: "30m"
        }
    )
}

export function generateRefreshToken(userDto: UserDto) {
    return jwt.sign(
        {
            user_idx: userDto.userIdx
        },
        jwtRefreshSecretKey,
        {
            issuer: "choiminseo",
            expiresIn: "7d"
        }
    )
}