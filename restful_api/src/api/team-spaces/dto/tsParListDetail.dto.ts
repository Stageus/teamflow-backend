interface ITSParListDetaiDto {
    teamSpaceIdx?: number,
    teamSpaceName?: string,
    roleIdx?: number,
    generalManagerNickname?: string,
    generalManagerEmail?: string
}

export class TSParListDetailDto implements ITSParListDetaiDto{
    teamSpaceIdx?: number
    teamSpaceName?: string
    roleIdx?: number
    generalManagerNickname?: string
    generalManagerEmail?: string

    constructor(data?: Partial<ITSParListDetaiDto>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}