import { Request, Response, NextFunction } from 'express'
import { TeamSpaceService } from './team-spaces.service';
import { TeamSpaceDto } from './dto/team-spaes.dto';
import { UserDto } from '../users/dto/users.dto';

interface ITeamSpaceController {
    addTeamSpace (req: Request, res: Response, next: NextFunction): Promise<void>
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

    async getUserList (req: Request, res: Response, next: NextFunction) {
        const teamSpaceDto = new TeamSpaceDto({
            teamSpaceIdx: parseInt(req.params.teamSpaceIdx),
            searchWord: req.query.searchWord?.toString()
        })

        
    }
}