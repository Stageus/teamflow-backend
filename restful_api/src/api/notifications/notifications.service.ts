import { MongoClient } from "mongodb";
import { Pool } from "pg";
import { CustomError } from "../../common/exception/customError";
import { NotificationRepository } from "./dao/notifications.repo";
import { NotificationDto } from "./dto/notification.dto";
import { UserRepository } from "../users/dao/users.repo";
import { UserEntity } from "../users/entity/users.entity";
import { InvitedNotificationEntity } from "./entity/invitedNotification.entity";
import { InvitedNotificationDto } from "./dto/invitedNotification.dto";
import { chInvitation, tsInvitation } from "../../common/const/notification_type";
import { TeamSpaceRepository } from "../team-spaces/dao/team-sapces.repo";
import { ChannelRepository } from "../channels/dao/channels.repo";
import { UserDto } from "../users/dto/users.dto";
import { TSMemberEntity } from "../team-spaces/entity/tsMember.entity";
import { ChannelMemberEntity } from "../channels/entity/channelMember.entity";

interface INotificationService {
    selectInvitationList(notificationDto: NotificationDto): Promise<InvitedNotificationDto[]>
    acceptInvitation(userDto: UserDto, invitedNotificationDto: InvitedNotificationDto): Promise<void>
    rejectInvitation(userDto: UserDto, invitedNotificationDto: InvitedNotificationDto): Promise<void>
}

export class NotificationService implements INotificationService {
    private customError: CustomError

    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly userRepository: UserRepository,
        private readonly teamSpaceRepository: TeamSpaceRepository,
        private readonly channelRepository: ChannelRepository,
        private readonly pool: Pool,
        private readonly client: MongoClient
    ) {
        this.customError = new CustomError()
    }

    async selectInvitationList(notificationDto: NotificationDto): Promise<InvitedNotificationDto[]> {
        const userEntity = new UserEntity({
            userIdx: notificationDto.userIdx
        }) 

        await this.userRepository.getUserEmail(userEntity, this.pool)

        const invitedNotificationEntity = new InvitedNotificationEntity({
            sendToUserEmail: userEntity.email,
            sendToUserIdx: notificationDto.userIdx
        })

        const invitedEntityList = await this.notificationRepository.getInvitationList(notificationDto.page!, invitedNotificationEntity, this.client)

        if (invitedEntityList.length === 0) {
            throw this.customError.notFoundException('더 이상 초대된 목록이 없음')
        }

        const invitedDtoList: InvitedNotificationDto[] = []

        for (let i = 0; i < invitedEntityList.length; i++) {
            const notification = new InvitedNotificationDto()

            if (invitedEntityList[i].notificationTypeIdx === tsInvitation) {
                notification.notificationIdx = invitedEntityList[i].notificationIdx
                notification.teamSpaceIdx = invitedEntityList[i].teamSpaceIdx
                notification.createdAt = invitedEntityList[i].createdAt
            } else {
                notification.notificationIdx = invitedEntityList[i].notificationIdx
                notification.channelIdx = invitedEntityList[i].channelIdx
                notification.createdAt = invitedEntityList[i].createdAt
            }

            invitedDtoList.push(notification)
        }

        return invitedDtoList
    }

    async acceptInvitation(userDto: UserDto, invitedNotificationDto: InvitedNotificationDto): Promise<void> {
        const invitedNotificationEntity = new InvitedNotificationEntity({
            notificationIdx: invitedNotificationDto.notificationIdx,
            sendToUserIdx: userDto.userIdx
        })

        await this.notificationRepository.getInvitation(invitedNotificationEntity, this.client)

        if (new Date().getTime() - invitedNotificationEntity.createdAt!.getTime() >= 24 * 3600 * 1000 * 7) {
            throw this.customError.notFoundException('초대 유효시간이 지남')
        }

        if (invitedNotificationEntity.notificationTypeIdx === tsInvitation) {
            const tsMemberEntity = new TSMemberEntity({
                teamSpaceIdx: invitedNotificationEntity.teamSpaceIdx,
                tsUserIdx: userDto.userIdx
            })

            await this.teamSpaceRepository.getTSMemberByIdx(tsMemberEntity, this.pool)

            if (tsMemberEntity.roleIdx) {
                throw this.customError.conflictException('이미 teamspace 소속 user')
            }

            await this.notificationRepository.acceptTSInvitation(invitedNotificationEntity, this.pool)
        }

        if (invitedNotificationEntity.notificationTypeIdx === chInvitation) {
            const chMemberEntity = new ChannelMemberEntity({
                channelIdx: invitedNotificationEntity.channelIdx,
                channelUserIdx: userDto.userIdx
            })

            const isChUser = await this.channelRepository.getIsChannelUser(chMemberEntity, this.pool)

            if (isChUser) {
                throw this.customError.conflictException('이미 채널 소속 user')
            }

            await this.notificationRepository.acceptChInvitation(invitedNotificationEntity, this.pool)
        }
    }

    async rejectInvitation(userDto: UserDto, invitedNotificationDto: InvitedNotificationDto): Promise<void> {
        const invitedNotificationEntity = new InvitedNotificationEntity({
            notificationIdx: invitedNotificationDto.notificationIdx,
            sendToUserIdx: userDto.userIdx
        })

        await this.notificationRepository.getInvitation(invitedNotificationEntity, this.client)

        if (invitedNotificationEntity.notificationTypeIdx === tsInvitation) {
            await this.notificationRepository.rejectTSInvitation(invitedNotificationEntity, this.pool)
        }

        if (invitedNotificationEntity.notificationTypeIdx === chInvitation) {
            await this.notificationRepository.rejectChInvitation(invitedNotificationEntity, this.pool)
        }
    }
}