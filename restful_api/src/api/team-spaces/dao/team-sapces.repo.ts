import { Pool } from "pg";

interface ITeamSpaceRepository {

}

export class TeamSpaceRepository implements ITeamSpaceRepository {
    constructor (
        private readonly pool : Pool
    ) {}
}