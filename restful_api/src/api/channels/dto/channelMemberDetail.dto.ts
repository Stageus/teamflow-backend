interface IChMemberDetailDto {
    channelUserIdx: number | undefined
    roleIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined
}

export class ChMemberDetailDto implements IChMemberDetailDto {
    channelUserIdx: number | undefined
    roleIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined

    constructor(
       data?: Partial<IChMemberDetailDto>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}