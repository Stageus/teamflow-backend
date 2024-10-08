interface ITeamSpaceEntity {
    teamSpaceIdx?: number,
    ownerIdx?: number,
    teamSpaceName?: string,
    createdAt?: Date
}

export class TeamSpaceEntity implements ITeamSpaceEntity {
    teamSpaceIdx?: number
    ownerIdx?: number
    teamSpaceName?: string
    createdAt?: Date
    
    constructor (data?: Partial<ITeamSpaceEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}