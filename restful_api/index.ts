import "dotenv/config"
import express, { Request, Response, NextFunction } from 'express'
import cookieParser from "cookie-parser"
import { errorHandler } from "./src/common/exception/errorHandler"
import { notFoundException } from "./src/common/exception/NotFoundException"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(notFoundException("router not found"))
app.use(errorHandler)

app.listen(3001, () => console.log("listening port on 3001"))