interface IUserEntity {
    userIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined
    isDeleted: boolean | undefined
}

export class UserEntity implements IUserEntity {
    userIdx: number | undefined
    nickname: string | undefined
    email: string | undefined
    profile: string | undefined
    isDeleted: boolean | undefined

    constructor(data?: Partial<IUserEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}