interface ITSMemberDetailDto {
    tsUserIdx?: number
    roleIdx?: number
    nickname?: string
    email?: string
    profile?: string
    teamSpaceName?: string
}

export class TSMemberDetailDto implements ITSMemberDetailDto {
    tsUserIdx?: number
    roleIdx?: number
    nickname?: string
    email?: string
    profile?: string
    teamSpaceName?: string

    constructor(
       data?: Partial<ITSMemberDetailDto>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}