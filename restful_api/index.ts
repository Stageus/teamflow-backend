import "dotenv/config"
import express, { Request, Response, NextFunction } from 'express'
import cookieParser from "cookie-parser"
import { CustomError } from "./src/common/exception/customError"

const app = express()

app.use(express.json())
app.use(cookieParser())

const customError = new CustomError

app.use(customError.conflictException("router not found"))
app.use(customError.errorHandler)

app.listen(3001, () => console.log("listening port on 3001"))