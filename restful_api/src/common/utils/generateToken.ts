import jwt from 'jsonwebtoken'
import { jwtAccessSecretKey, jwtRefreshSecretKey } from '../const/environment'

export function generateSignUpToken(email: string, profile: string) {
    return jwt.sign(
        {
            email: email,
            profile: profile
        },
        jwtAccessSecretKey,
        {
            issuer: "choiminseo",
            expiresIn: "30m"
        }
    )
}

export function generateAccessToken(user_idx: number) {
    return jwt.sign(
        {
            user_idx: user_idx
        },
        jwtAccessSecretKey,
        {
            issuer: "choiminseo",
            expiresIn: "30m"
        }
    )
}

export function generateRefreshToken(user_idx: number) {
    return jwt.sign(
        {
            user_idx: user_idx
        },
        jwtRefreshSecretKey,
        {
            issuer: "choiminseo",
            expiresIn: "7d"
        }
    )
}