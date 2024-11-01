import 'dotenv/config'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import pool from './common/database/postgresql'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true
    }
})

io.on('connection', (socket) => {
    socket.on('join_teamspace', async (teamspaceIdx : number) => {
        const channelIdxQueryResult = await pool.query(
            `SELECT ch_idx FROM team_flow_management.channel WHERE ts_idx=$1`,
            [teamspaceIdx]
        )

        for (let i = 0; i < channelIdxQueryResult.rows.length; i++) {
            socket.join(channelIdxQueryResult.rows[i])
        }
    })
})

server.listen(3002, () => {
    console.log(`server running on port 3002`)
})