interface IChannelListDto {
    channelIdx: number | undefined,
    channelName: string | undefined,
    roleIdx: number | undefined,
    isChannelOwner: boolean | undefined
}

export class ChannelListDto implements IChannelListDto {
    channelIdx: number | undefined
    channelName: string | undefined
    roleIdx: number | undefined
    isChannelOwner: boolean | undefined

    constructor(
       data?: Partial<IChannelListDto>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}