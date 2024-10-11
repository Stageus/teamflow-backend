import "dotenv/config"
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import { CustomError } from "./src/common/custom/customError"
import { serverPort } from "./src/common/const/environment"
import userRouter from "./src/api/users/users.router"
import teamSpaceRouter from "./src/api/team-spaces/team-spaces.router"
import channelRouter from "./src/api/channels/channels.router"
import invitationRouter from "./src/api/invitations/invitations.router"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: '*'
}))

app.use("/users", userRouter)
app.use("/team-spaces", teamSpaceRouter)
app.use("/channels", channelRouter)
app.use("/invitations", invitationRouter)

const customError = new CustomError()

app.use((req: Request, res: Response, next: NextFunction) => {
    next(customError.conflictException('router not found'))
})

app.use(customError.errorHandler)

app.listen(serverPort, () => console.log(`listening port on ${serverPort}`))