interface IChMemberDetailEntity {
    channelUserIdx: number | undefined
    roleIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined
}

export class ChMemberDetailEntity implements IChMemberDetailEntity {
    channelUserIdx: number | undefined
    roleIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined

    constructor(
       data?: Partial<IChMemberDetailEntity>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}