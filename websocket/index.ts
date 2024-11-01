import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import pool from './common/database/postgresql'
import { privateType } from './common/const/ch_type'
import jwt from 'jsonwebtoken'
import { jwtAccessSecretKey, jwtRefreshSecretKey } from './common/const/environment'

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
    socket.on('join_teamspace', async (teamspaceIdx : number) => {
        const channelIdxQueryResult = await pool.query(
            `SELECT ch_idx FROM team_flow_management.channel WHERE ts_idx=$1 AND ch_type_idx <> $2`,
            [teamspaceIdx, privateType]
        )

        for (let i = 0; i < channelIdxQueryResult.rows.length; i++) {
            socket.join(channelIdxQueryResult.rows[i])
        }
    })

    socket.on('join_channel', async (channelIdx : number) => {
        socket.join(channelIdx.toString())
    })
})

server.listen(3002, () => {
    console.log(`server running on port 3002`)
})