import "dotenv/config"
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import { CustomError } from "./src/common/exception/customError"
import { serverPort } from "./src/common/const/environment"
import userRouter from "./src/api/users/users.router"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: '*'
}))

app.use("/users", userRouter)

const customError = new CustomError()

app.use((req: Request, res: Response, next: NextFunction) => {
    next(customError.conflictException('router not found'))
})

app.use(customError.errorHandler)

app.listen(serverPort, () => console.log(`listening port on ${serverPort}`))