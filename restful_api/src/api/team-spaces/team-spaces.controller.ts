import { Request, Response, NextFunction } from 'express'
import { TeamSpaceService } from './team-spaces.service';

interface ITeamSpaceController {

}

export class TeamSpaceController implements ITeamSpaceController {
    constructor(
        private readonly teamSpaceService : TeamSpaceService
    ){}
}