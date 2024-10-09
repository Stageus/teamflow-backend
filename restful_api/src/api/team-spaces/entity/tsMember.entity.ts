interface ITSMemberEntity {
    tsUserIdx?: number,
    roleIdx?: number,
    teamSpaceIdx?: number,
    joinedAt?: Date
}

export class TSMemberEntity implements ITSMemberEntity{
    tsUserIdx?: number
    roleIdx?: number
    teamSpaceIdx?: number
    joinedAt?: Date

    constructor(data?: Partial<ITSMemberEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}