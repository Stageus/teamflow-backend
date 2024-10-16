import { NextFunction, Request, Response } from "express";
import { ThreadService } from "./threads.service";
import { UserDto } from "../users/dto/users.dto";
import { ThreadsDto } from "./dto/threads.dto";

interface IThreadController {
    getThreadList(req: Request, res: Response, next: NextFunction): Promise<void>
}

export class ThreadController implements IThreadController {
    constructor(
        private readonly threadsService: ThreadService
    ){}

    async getThreadList(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })

        const threadsDto = new ThreadsDto({
            channelIdx: req.body.channelIdx
        })

        const threadList = await this.threadsService.selectThreadList(userDto, threadsDto)

        if (!req.body.accessToken) {
            res.status(200).send([threadList])
        } else {
            res.status(203).send([[threadList], [{ accessToken: req.body.accessToken }]])
        }
    }
}