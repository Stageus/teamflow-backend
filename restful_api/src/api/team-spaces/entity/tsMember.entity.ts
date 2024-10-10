interface ITSMemberEntity {
    tsUserIdx?: number,
    roleIdx?: number,
    teamSpaceIdx?: number,
    joinedAt?: Date
    teamSpaceName?: string
}

export class TSMemberEntity implements ITSMemberEntity{
    tsUserIdx?: number
    roleIdx?: number
    teamSpaceIdx?: number
    joinedAt?: Date
    teamSpaceName?: string

    constructor(data?: Partial<ITSMemberEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}