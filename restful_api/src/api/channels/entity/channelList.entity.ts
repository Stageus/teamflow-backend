interface IChannelListEntity {
    channelIdx?: number,
    channelName?: string,
    roleIdx?: number,
    ownerIdx?: number
}

export class ChannelListEntity implements IChannelListEntity {
    channelIdx?: number
    channelName?: string
    roleIdx?: number
    ownerIdx?: number

    constructor(
       data?: Partial<IChannelListEntity>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}