import 'dotenv/config'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import pool from './common/database/postgresql'
import { privateType } from './common/const/ch_type'
import jwt from 'jsonwebtoken'
import { jwtAccessSecretKey, jwtRefreshSecretKey, serverPort } from './common/const/environment'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

io.use((socket, next) => {
    const accessTokenHeader = socket.handshake.headers.accesstoken?.toString()
    const refreshTokenHeader = socket.handshake.headers.refreshtoken?.toString()

    if (!accessTokenHeader) {
        return next(new Error('no token provided'))
    }

    let accessTokenValid = false

    jwt.verify(accessTokenHeader, jwtAccessSecretKey, (err: any, decoded: any) => {
        if (err) {
            accessTokenValid = false
        } else {
            accessTokenValid = true
        }
    })

    let accessTokenDecoded

    if (!accessTokenValid) {
        if (!refreshTokenHeader) {
            return next(new Error('need to login'))
        }

        const refreshTokenDecoded = jwt.verify(
            refreshTokenHeader,
            jwtRefreshSecretKey
        ) as jwt.JwtPayload

        const accessToken = jwt.sign(
            {
                userIdx : refreshTokenDecoded.userIdx
            },
            jwtAccessSecretKey,
            {
                issuer: "choiminseo",
                expiresIn: "30m"
            }
        )

        accessTokenDecoded = jwt.verify(
            accessToken,
            jwtAccessSecretKey
        ) as jwt.JwtPayload

        socket.data.accessToken = accessToken
    } else {
        accessTokenDecoded = jwt.verify(
            accessTokenHeader,
            jwtAccessSecretKey
        ) as jwt.JwtPayload
    }

    socket.data.userIdx = accessTokenDecoded.userIdx

    next()
})

io.on('connection', (socket) => {
    
    if (socket.data.accessToken) {
        socket.emit('accessToken_resign', { accessToken : socket.data.accessToken })
    }
})
  
server.listen(serverPort, () => {
    console.log(`server running on port ${serverPort}`)
})