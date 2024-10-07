interface IUserEntity {
    userIdx?: number
    nickname?: string
    email?: string
    profile?: string
    isDeleted?: boolean
}

export class UserEntity implements IUserEntity {
    userIdx?: number
    nickname?: string
    email?: string
    profile?: string
    isDeleted?: boolean

    constructor(data?: Partial<IUserEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}