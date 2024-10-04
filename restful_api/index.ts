import "dotenv/config"
import express, { Request, Response, NextFunction } from 'express'
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
    next()
})