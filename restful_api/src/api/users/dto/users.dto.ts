interface IUserDto {
    userIdx?: number
    email?: string
    profile?: string
}

export class UserDto implements IUserDto {
    userIdx?: number
    email?: string
    profile?: string

    constructor(data?: Partial<IUserDto>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}