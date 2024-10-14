interface IChannelMemberEntity {
    teamSpaceIdx: number | undefined
    channelIdx: number | undefined,
    channelUserIdx: number | undefined
}

export class ChannelMemberEntity implements IChannelMemberEntity {
    teamSpaceIdx: number | undefined
    channelIdx: number | undefined
    channelUserIdx: number | undefined

    constructor(data?: Partial<IChannelMemberEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}