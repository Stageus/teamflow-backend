interface IThreadsEntity {
    threadIdx: number | undefined,
    channelIdx: number | undefined,
    content: string | undefined,
    file: string[] | undefined,
    authorIdx: number | undefined,
    authorName: string | undefined,
    isAuthor: boolean | undefined,
    createdAt : Date | undefined,
    isUpdated : boolean | undefined,
    isMention : boolean | undefined
}

export class ThreadsEntity implements IThreadsEntity {
    threadIdx: number | undefined
    channelIdx: number | undefined
    content: string | undefined
    file: string[] | undefined
    authorIdx: number | undefined
    authorName: string | undefined
    isAuthor: boolean | undefined
    createdAt: Date | undefined
    isUpdated: boolean | undefined
    isMention: boolean | undefined

    constructor(data?: Partial<IThreadsEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}