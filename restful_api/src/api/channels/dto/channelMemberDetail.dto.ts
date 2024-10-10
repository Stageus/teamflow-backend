interface IChMemberDetailDto {
    channelUserIdx?: number
    roleIdx?: number
    nickname?: string
    email?: string
    profile?: string
}

export class ChMemberDetailDto implements IChMemberDetailDto {
    channelUserIdx?: number
    roleIdx?: number
    nickname?: string
    email?: string
    profile?: string

    constructor(
       data?: Partial<IChMemberDetailDto>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}