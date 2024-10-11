interface IChannelListDto {
    channelIdx?: number,
    channelName?: string,
    roleIdx?: number,
    isChannelOwner?: boolean
}

export class ChannelListDto implements IChannelListDto {
    channelIdx?: number
    channelName?: string
    roleIdx?: number
    isChannelOwner?: boolean

    constructor(
       data?: Partial<IChannelListDto>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}