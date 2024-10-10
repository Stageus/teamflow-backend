interface ITSParListDetailEntity {
    teamSpaceIdx?: number,
    teamSpaceName?: string,
    roleIdx?: number,
    generalManagerNickname?: string,
    generalManagerEmail?: string
}

export class TSParListDetailEntity implements ITSParListDetailEntity{
    teamSpaceIdx?: number
    teamSpaceName?: string
    roleIdx?: number
    generalManagerNickname?: string
    generalManagerEmail?: string

    constructor(data?: Partial<ITSParListDetailEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}