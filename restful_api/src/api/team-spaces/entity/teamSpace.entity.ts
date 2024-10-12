interface ITeamSpaceEntity {
    teamSpaceIdx: number | undefined,
    ownerIdx: number | undefined,
    teamSpaceName: string | undefined,
    createdAt: Date | undefined
}

export class TeamSpaceEntity implements ITeamSpaceEntity {
    teamSpaceIdx: number | undefined
    ownerIdx: number | undefined
    teamSpaceName: string | undefined
    createdAt: Date | undefined
    
    constructor (data?: Partial<ITeamSpaceEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}