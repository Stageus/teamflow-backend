interface ITSParListDetailEntity {
    teamSpaceIdx: number | undefined,
    teamSpaceName: string | undefined,
    roleIdx: number | undefined,
    generalManagerNickname: string | undefined,
    generalManagerEmail: string | undefined
}

export class TSParListDetailEntity implements ITSParListDetailEntity{
    teamSpaceIdx: number | undefined
    teamSpaceName: string | undefined
    roleIdx: number | undefined
    generalManagerEmail: string | undefined
    generalManagerNickname: string | undefined

    constructor(data?: Partial<ITSParListDetailEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}