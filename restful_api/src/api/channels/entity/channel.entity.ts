interface IChannelEntity {
    channelIdx: number | undefined,
    teamSpaceIdx: number | undefined,
    chTypeIdx: number | undefined,
    ownerIdx?: number | undefined,
    channelName: string | undefined,
    createdAt: Date | undefined
}

export class ChannelEntity implements IChannelEntity {
    channelIdx: number | undefined
    teamSpaceIdx: number | undefined
    chTypeIdx: number | undefined
    ownerIdx?: number | undefined
    channelName: string | undefined
    createdAt: Date | undefined

    constructor(data?: Partial<IChannelEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}