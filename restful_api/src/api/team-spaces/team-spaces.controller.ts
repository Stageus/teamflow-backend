import { Request, Response, NextFunction } from 'express'
import { TeamSpaceService } from './team-spaces.service';
import { TeamSpaceDto } from './dto/teamSpace.dto';
import { UserDto } from '../users/dto/users.dto';
import { TSMemberDto } from './dto/tsMember.dto';

interface ITeamSpaceController {
    addTeamSpace (req: Request, res: Response, next: NextFunction): Promise<void>
    putTeamSpace (req: Request, res: Response, next: NextFunction): Promise<void> 
    deleteTeamSpace (req: Request, res: Response, next: NextFunction): Promise<void> 
    getUserList (req: Request, res: Response, next: NextFunction): Promise<void>
    putUserAuth (req: Request, res: Response, next: NextFunction): Promise<void>
    deleteTSUser (req: Request, res: Response, next: NextFunction): Promise<void>
    getTSList (req: Request, res: Response, next: NextFunction): Promise<void> 
    getTSOwnList (req: Request, res: Response, next: NextFunction): Promise<void>
    getTSParList (req: Request, res: Response, next: NextFunction): Promise<void>
}

export class TeamSpaceController implements ITeamSpaceController {
    constructor(
        private readonly teamSpaceService : TeamSpaceService
    ){}

    async addTeamSpace (req: Request, res: Response, next: NextFunction): Promise<void> {
        const teamSpaceDto = new TeamSpaceDto({
            ownerIdx: req.body.userIdx,
            teamSpaceName: req.body.teamSpaceName
        })

        await this.teamSpaceService.createTeamSpace(teamSpaceDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken : req.body.accessToken })
        }
    }

    async putTeamSpace (req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })
        
        const teamSpaceDto = new TeamSpaceDto({
            teamSpaceIdx: parseInt(req.params.teamSpaceIdx),
            teamSpaceName: req.body.teamSpaceName
        })

        await this.teamSpaceService.updateTeamSpace(userDto, teamSpaceDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken: req.body.accessToken })
        }
    }

    async deleteTeamSpace (req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })

        const teamSpaceDto = new TeamSpaceDto({
            teamSpaceIdx: parseInt(req.params.teamSpaceIdx)
        })

        await this.teamSpaceService.deleteTeamSpace(userDto, teamSpaceDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken: req.body.accessToken })
        }
    }

    async getUserList (req: Request, res: Response, next: NextFunction): Promise<void> {
        const tsMemberDto = new TSMemberDto({
            teamSpaceIdx: parseInt(req.params.teamSpaceIdx),
            searchWord: req.query.searchWord?.toString()
        })

        const tsMemberList = await this.teamSpaceService.selectUserList(tsMemberDto)

        if (!req.body.accessToken) {
            res.status(200).send([tsMemberList])
        } else {
            const response = [[tsMemberList], [{accessToken: req.body.accessToken}]]
            res.status(203).send(response)
        }
    }

    async putUserAuth (req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto ({
            userIdx: req.body.userIdx
        })
        
        const tsMemberDto = new TSMemberDto({
            teamSpaceIdx: parseInt(req.params.teamSpaceIdx),
            tsUserIdx: req.body.tsUserIdx
        })

        await this.teamSpaceService.updateUserAuth(userDto, tsMemberDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken : req.body.accessToken })
        }
    }

    async deleteTSUser (req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })

        const tsMemberDto = new TSMemberDto({
            teamSpaceIdx: parseInt(req.params.teamSpaceIdx),
            tsUserIdx: req.body.tsUserIdx
        })

        await this.teamSpaceService.deleteTSUser(userDto, tsMemberDto)

        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken: req.body.accessToken })
        }
    }

    async leaveTS (req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDto = new UserDto({
            userIdx: req.body.userIdx
        })

        const tsMemberDto = new TSMemberDto({
            teamSpaceIdx: parseInt(req.params.teamSpaceIdx)
        })

        await this.teamSpaceService.deleteMeFromTS(userDto, tsMemberDto)
        
        if (!req.body.accessToken) {
            res.status(200).send()
        } else {
            res.status(203).send({ accessToken: req.body.accessToken })
        }
    }

    async getTSList (req: Request, res: Response, next: NextFunction): Promise<void> {
        const tsMemberDto = new TSMemberDto({
            tsUserIdx: req.body.userIdx
        })

        const tsList = await this.teamSpaceService.selectTSList(tsMemberDto)

        if (!req.body.accessToken) {
            res.status(200).send([tsList])
        } else {
            res.status(203).send([[tsList], [{ accessToken : req.body.accessToken }]])
        }
    }

    async getTSOwnList (req: Request, res: Response, next: NextFunction): Promise<void> {
        const teamSpaceDto = new TeamSpaceDto({
            ownerIdx: req.body.userIdx,
            page: Number(req.query.page)
        })

        const tsOwnList = await this.teamSpaceService.selectTSOwnList(teamSpaceDto)

        if (!req.body.accessToken) {
            res.status(200).send([tsOwnList])
        } else {
            res.status(203).send([[tsOwnList], [{ accessToken: req.body.accessToken}]])
        }
    }

    async getTSParList (req: Request, res: Response, next: NextFunction): Promise<void> {
        const tsMemberDto = new TSMemberDto({
            tsUserIdx: req.body.userIdx,
            page: Number(req.query.page)
        })

        const tsParList = await this.teamSpaceService.selectTSParList(tsMemberDto)

        if (!req.body.accessToken) {
            res.status(200).send([tsParList])
        } else {
            res.status(203).send([[tsParList], [{ accessToken : req.body.accessToken }]])
        }
    }
}