interface ITSMemberDetailDto {
    userIdx?: number
    roleIdx?: number
    nickname?: string
    email?: string
    profile?: string
}

export class TSMemberDetailDto implements ITSMemberDetailDto {
    userIdx: number | undefined
    roleIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined

    constructor(
       data: ITSMemberDetailDto
    ) {
        this.userIdx = data.userIdx,
        this.roleIdx = data.roleIdx,
        this.nickname = data.nickname,
        this.email = data.email,
        this.profile = data.profile
    }
}