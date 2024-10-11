interface IChManagerDetailDto {
    channelIdx?: number,
    channelName?: string,
    managerIdx?: number | null,
    managerNickname?: string | null
}

export class ChManagerDetailDto implements IChManagerDetailDto {
    channelIdx?: number
    channelName?: string
    managerIdx?: number | null
    managerNickname?: string | null

    constructor(
       data?: Partial<IChManagerDetailDto>
    ) { 
        if (data) {
            Object.assign(this, data)
        }
    }
}