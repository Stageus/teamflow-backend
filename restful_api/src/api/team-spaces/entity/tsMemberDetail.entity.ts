interface ITSMemberDetailEntity {
    tsUserIdx?: number
    roleIdx?: number
    nickname?: string
    email?: string
    profile?: string
}

export class TSMemberDetailEntity implements ITSMemberDetailEntity {
    tsUserIdx?: number
    roleIdx?: number
    nickname?: string
    email?: string
    profile?: string

    constructor(
        data?: Partial<ITSMemberDetailEntity>
    ) {
        if (data) {
            Object.assign(this, data)
        }
    }
}