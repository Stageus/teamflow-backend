interface IChManagerDetailEntity {
    channelIdx: number | undefined,
    channelName: string | undefined,
    managerIdx?: number | undefined,
    managerNickname: string | undefined
}

export class ChManagerDetailEntity implements IChManagerDetailEntity {
    channelIdx: number | undefined
    channelName: string | undefined
    managerIdx?: number | undefined
    managerNickname: string | undefined

    constructor(
       data?: Partial<IChManagerDetailEntity>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}