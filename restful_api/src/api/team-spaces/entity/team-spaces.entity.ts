interface ITeamSpaceEntity {
    teamSpaceIdx?: number,
    ownerIdx?: number,
    teamSpaceName?: string,
    createdAt?: Date
}

export class TeamSpaceEntity implements ITeamSpaceEntity {
    constructor (data?: Partial<ITeamSpaceEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}