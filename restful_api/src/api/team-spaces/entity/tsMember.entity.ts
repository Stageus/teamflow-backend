interface ITSMemberEntity {
    tsMemberIdx?: number,
    userIdx?: number,
    tsRoleIdx?: number,
    teamSpaceIdx?: number,
    joinedAt?: Date
}

export class TSMemberEntity implements ITSMemberEntity{
    tsMemberIdx?: number
    userIdx?: number
    tsRoleIdx?: number
    teamSpaceIdx?: number
    joinedAt?: Date

    constructor(data?: Partial<ITSMemberEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}