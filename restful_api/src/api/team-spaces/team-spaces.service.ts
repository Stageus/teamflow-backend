import { Pool } from "pg";
import { TeamSpaceRepository } from "./dao/team-sapces.repo";

interface ITeamSpaceService {

}

export class TeamSpaceService {
    constructor (
        private readonly teamSpaceRepo : TeamSpaceRepository,
        private readonly pool : Pool
    ) {}
}