interface IChannelListEntity {
    channelIdx: number | undefined,
    channelName: string | undefined,
    roleIdx: number | undefined,
    ownerIdx?: number | undefined
}

export class ChannelListEntity implements IChannelListEntity {
    channelIdx: number | undefined
    channelName: string | undefined
    roleIdx: number | undefined
    ownerIdx?: number | undefined

    constructor(
       data?: Partial<IChannelListEntity>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}