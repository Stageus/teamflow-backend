import "dotenv/config"
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import { CustomError } from "./src/common/exception/customError"
import { serverPort } from "./src/common/const/environment"
import userRouter from "./src/api/users/users.router"
import teamSpaceRouter from "./src/api/team-spaces/team-spaces.router"
import channelRouter from "./src/api/channels/channels.router"
import invitationRouter from "./src/api/invitations/invitations.router"
import notificationRouter from "./src/api/notifications/notifications.router"
import threadRouter from "./src/api/threads/threads.router"

const app = express()

app.use(express.json())
// local 환경에서 test 못함,,, test 해보깅1!!
// 프론트엔드가 cookie 관리하기
app.use(cookieParser())
app.use(cors({
    origin: '*'
}))

app.use("/users", userRouter)
app.use("/team-spaces", teamSpaceRouter)
app.use("/channels", channelRouter)
app.use("/invitations", invitationRouter)
app.use("/notifications", notificationRouter)
app.use("/threads", threadRouter)

const customError = new CustomError()

app.use((req: Request, res: Response, next: NextFunction) => {
    next(customError.conflictException('router not found'))
})

app.use(customError.errorHandler)

app.listen(serverPort, () => console.log(`listening port on ${serverPort}`))