import { NextFunction, Request, Response } from "express";
import { ChannelService } from "./channels.service";
import { ChannelDto } from "./dto/channel.dto";
import { UserDto } from "../users/dto/users.dto";
import { ChannelMemberDto } from "./dto/channelMember.dto";
import { ChannelMemberEntity } from "./entity/channelMember.entity";

interface IChannelController {
    addChannel (req: Request, res: Response, next: NextFunction): Promise<void> 
    putChannelName (req: Request, res: Response, next: NextFunction): Promise<void>
    deleteChannel (req: Request, res: Response, next: NextFunction): Promise<void>
    deleteChannelUser(req: Request, res: Response, next: NextFunction): Promise<void>
    getChannelUserList(req: Request, res: Response, next: NextFunction): Promise<void>
    putChannelManager(req: Request, res: Response, next: NextFunction): Promise<void>
    getChannelList(req: Request, res: Response, next: NextFunction): Promise<void>
    getMyChannelList(req: Request, res: Response, next: NextFunction): Promise<void>
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

    async putChannelName (req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })
        
        const channelDto = new ChannelDto({
            channelIdx: parseInt(req.params.channelIdx),
            channelName: req.body.channelName
        })

        await this.channelService.updateChannelName(userDto, channelDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken : req.body.accessToken })
        }
    }

    async deleteChannel (req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })

        const channelDto = new ChannelDto({
            channelIdx: parseInt(req.params.channelIdx)
        })

        await this.channelService.deleteChannel(userDto, channelDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken : req.body.accessToken })
        }
    }

    async deleteChannelUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })

        const channelMemberDto = new ChannelMemberDto({
            channelIdx: parseInt(req.params.channelIdx),
            channelUserIdx: req.body.channelUserIdx
        })

        await this.channelService.deleteChannelUser(userDto, channelMemberDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken : req.body.accessToken })
        }
    }

    async leaveChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })

        const channelMemberDto = new ChannelMemberDto({
            channelIdx: parseInt(req.params.channelIdx)
        })

        await this.channelService.deleteMeFromChannel(userDto, channelMemberDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken : req.body.accessToken })
        }
    }

    async getChannelUserList(req: Request, res: Response, next: NextFunction): Promise<void> {
        const channelMemberDto = new ChannelMemberDto({
            channelIdx: parseInt(req.params.channelIdx),
            searchWord: req.query.searchWord?.toString()
        })

        const userList = await this.channelService.selectChannelUserList(channelMemberDto)

        if (!req.body.accessToken) {
            res.status(200).send([userList])
        } else {
            res.status(203).send([[userList], [{ accessToken: req.body.accessToken }]])
        }
    }

    async putChannelManager(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })

        const channelMemberDto = new ChannelMemberDto({
            channelIdx: parseInt(req.params.channelIdx),
            channelUserIdx: req.body.channelUserIdx
        })

        await this.channelService.updateChannelManager(userDto, channelMemberDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken : req.body.accessToken })
        }
    }

    async getChannelList(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })

        const channelDto = new ChannelDto({
            teamSpaceIdx: req.body.teamSpaceIdx,
            searchWord: req.query.searchWord?.toString()
        })

        const channelList = await this.channelService.selectChannelList(userDto, channelDto)

        if (!req.body.accessToken) {
            res.status(200).send([channelList])
        } else {
            res.status(203).send([[channelList], [{ accessToken: req.body.accessToken }]])
        }
    }

    async getMyChannelList(req: Request, res: Response, next: NextFunction): Promise<void> {
        const channelMemberDto = new ChannelMemberDto({
            teamSpaceIdx: req.body.teamSpaceIdx,
            channelUserIdx: req.body.userIdx
        })

        const myChannelList = await this.channelService.selectMyChannelList(channelMemberDto)

        if (!req.body.accessToken) {
            res.status(200).send([myChannelList])
        } else {
            res.status(203).send([[myChannelList], [{ accessToken: req.body.accessToken }]])
        }
    }
}