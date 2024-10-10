interface IChannelEntity {
    channelIdx?: number,
    teamSpaceIdx?: number,
    chTypeIdx?: number,
    ownerIdx?: number,
    channelName?: string,
    createdAt?: Date
}

export class ChannelEntity implements IChannelEntity {
    channelIdx?: number
    teamSpaceIdx?: number
    chTypeIdx?: number
    ownerIdx?: number
    channelName?: string
    createdAt?: Date

    constructor(data?: Partial<IChannelEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}