import "dotenv/config"
import express, { Request, Response, NextFunction } from 'express'
import cookieParser from "cookie-parser"
import { Exception } from "./src/common/exception/exception"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use((req: Request, res: Response, next: NextFunction) => {
    next()
})

app.use((err: Exception, req: Request, res: Response, next :NextFunction) => {
    if (
        err.message === "jwt expired" ||
        err.message === "invalid signature" ||
        err.message === "jwt must be provided"
    ) {
        res.status(401).send({
            message: err.message
        })
    } else {
        res.status(err.status_code || 500).send(err.message)
    }
})

app.listen(3001, () => console.log("listening port on 3001"))