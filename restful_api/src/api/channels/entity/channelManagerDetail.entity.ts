interface IChManagerDetailEntity {
    channelIdx?: number,
    channelName?: string,
    managerIdx?: number | null,
    managerNickname?: string | null
}

export class ChManagerDetailEntity implements IChManagerDetailEntity {
    channelIdx?: number
    channelName?: string
    managerIdx?: number | null
    managerNickname?: string | null

    constructor(
       data?: Partial<IChManagerDetailEntity>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}