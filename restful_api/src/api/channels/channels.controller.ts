import { NextFunction, Request, Response } from "express";
import { ChannelService } from "./entity/channels.service";
import { ChannelDto } from "./dto/channel.dto";

interface IChannelController {
    addChannel (req: Request, res: Response, next: NextFunction): Promise<void> 
}

export class ChannelController implements IChannelController {
    constructor(
        private readonly channelService : ChannelService
    ) {}

    async addChannel (req: Request, res: Response, next: NextFunction): Promise<void> {
        const channelDto = new ChannelDto({
            teamSpaceIdx: req.body.teamSpaceIdx,
            channelName: req.body.channelName,
            ownerIdx: req.body.userIdx
        })

        await this.channelService.createChannel(channelDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken : req.body.accessToken })
        }
    } 
}