interface ITSMemberEntity {
    tsMemberIdx?: number,
    userIdx?: number,
    tsRoleIdx?: number,
    tsIdx?: number,
    joinedAt?: Date
}

export class TSMemeberEntity implements ITSMemberEntity{
    tsMemberIdx?: number
    userIdx?: number
    tsRoleIdx?: number
    tsIdx?: number
    joinedAt?: Date

    constructor(data?: Partial<ITSMemberEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}