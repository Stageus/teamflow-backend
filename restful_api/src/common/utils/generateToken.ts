import jwt from 'jsonwebtoken'
import { jwtAccessSecretKey, jwtRefreshSecretKey } from '../const/environment'

export function generateAccessTokey(user_idx: number) {
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

export function generateSecretToken(user_idx: number) {
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