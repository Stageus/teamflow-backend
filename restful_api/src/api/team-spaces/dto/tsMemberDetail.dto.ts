interface ITSMemberDetailDto {
    tsUserIdx: number | undefined
    roleIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined
    teamSpaceName: string | undefined
}

export class TSMemberDetailDto implements ITSMemberDetailDto {
    tsUserIdx: number | undefined
    roleIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined
    teamSpaceName: string | undefined

    constructor(
       data?: Partial<ITSMemberDetailDto>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}