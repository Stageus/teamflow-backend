interface IChManagerDetailDto {
    channelIdx: number | undefined,
    channelName: string | undefined, 
    managerIdx?: number | undefined,
    managerNickname?: string | undefined
}

export class ChManagerDetailDto implements IChManagerDetailDto {
    channelIdx: number | undefined
    channelName: string | undefined
    managerIdx?: number | undefined
    managerNickname?: string | undefined

    constructor(
       data?: Partial<IChManagerDetailDto>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}