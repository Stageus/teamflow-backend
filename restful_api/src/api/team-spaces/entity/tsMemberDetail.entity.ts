interface ITSMemberDetailEntity {
    tsUserIdx: number | undefined
    roleIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined
}

export class TSMemberDetailEntity implements ITSMemberDetailEntity {
    tsUserIdx: number | undefined
    roleIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined

    constructor(
        data?: Partial<ITSMemberDetailEntity>
    ) {
        if (data) {
            Object.assign(this, data)
        }
    }
}