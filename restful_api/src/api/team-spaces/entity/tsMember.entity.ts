interface ITSMemberEntity {
    tsUserIdx: number | undefined,
    roleIdx: number | undefined,
    teamSpaceIdx: number | undefined,
    joinedAt: Date | undefined
    teamSpaceName: string | undefined
}

export class TSMemberEntity implements ITSMemberEntity{
    tsUserIdx: number | undefined
    roleIdx: number | undefined
    teamSpaceIdx: number | undefined
    joinedAt: Date | undefined
    teamSpaceName: string | undefined

    constructor(data?: Partial<ITSMemberEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}