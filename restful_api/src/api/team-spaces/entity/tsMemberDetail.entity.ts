interface ITSMemberDetailEntity {
    userIdx: number
    roleIdx: number
    nickname: string
    email: string
    profile: string
}

export class TSMemberDetailEntity implements ITSMemberDetailEntity {
    userIdx: number
    roleIdx: number
    nickname: string
    email: string
    profile: string

    constructor(
        data: ITSMemberDetailEntity
    ) {
        this.userIdx = data.userIdx,
        this.roleIdx = data.roleIdx,
        this.nickname = data.nickname,
        this.email = data.email,
        this.profile = data.profile
    }
}