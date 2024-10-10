interface IChMemberDetailEntity {
    channelUserIdx?: number
    roleIdx?: number
    nickname?: string
    email?: string
    profile?: string
}

export class ChMemberDetailEntity implements IChMemberDetailEntity {
    channelUserIdx?: number
    roleIdx?: number
    nickname?: string
    email?: string
    profile?: string

    constructor(
       data?: Partial<IChMemberDetailEntity>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}