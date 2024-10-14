interface IInvitedNotificationEntity {
    notificationIdx: number | undefined,
    notificationTypeIdx: number | undefined,
    teamSpaceIdx: number | undefined,
    channelIdx: number | undefined,
    sendByUserIdx: number | undefined,
    sendToUserEmail: string | undefined,
    sendToUserIdx: number | undefined,
    createdAt: Date | undefined,
    isRead: boolean | undefined
}

export class InvitedNotificationEntity implements IInvitedNotificationEntity {
    notificationIdx: number | undefined
    notificationTypeIdx: number | undefined
    teamSpaceIdx: number | undefined
    channelIdx: number | undefined
    sendByUserIdx: number | undefined
    sendToUserEmail: string | undefined
    sendToUserIdx: number | undefined
    createdAt: Date | undefined
    isRead: boolean | undefined

    constructor(data?: Partial<IInvitedNotificationEntity>) {
        if (data) {
            Object.assign(this, data)
        }
    }
}