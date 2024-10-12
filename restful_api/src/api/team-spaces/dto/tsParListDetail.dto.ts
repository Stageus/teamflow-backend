interface ITSParListDetaiDto {
    teamSpaceIdx: number | undefined,
    teamSpaceName: string | undefined,
    roleIdx: number | undefined,
    generalManagerNickname: string | undefined,
    generalManagerEmail: string | undefined
}

export class TSParListDetailDto implements ITSParListDetaiDto{
    teamSpaceIdx: number | undefined
    teamSpaceName: string | undefined
    roleIdx: number | undefined
    generalManagerNickname: string | undefined
    generalManagerEmail: string | undefined
    
    constructor(data?: Partial<ITSParListDetaiDto>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}