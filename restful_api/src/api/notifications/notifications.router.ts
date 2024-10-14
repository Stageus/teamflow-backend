import { Router } from 'express'
import { CheckVerifyToken } from '../../common/pipes/checkVerifyToken'
import { regx } from '../../common/const/regx'
import { controller } from '../index.controller'
import { wrapper } from '../../common/utils/wrapper'
import { InvitedNotificationDto } from './dto/invitedNotification.dto'

const notificationRouter = Router()

const checkVerifyToken = new CheckVerifyToken()
const invitatinonDto = new InvitedNotificationDto()

notificationRouter.get(
    "/invitation/list",
    checkVerifyToken.checkVerifyAccessToken(),
    wrapper(controller.notificationController.getInvitationList.bind(controller.notificationController))
)

notificationRouter.post(
    "/:notificationIdx/invitation/accept",
    checkVerifyToken.checkVerifyAccessToken(),
    invitatinonDto.checkRegx([
        ['notificationIdx', regx.idxRegx]
    ]),
    wrapper(controller.notificationController.acceptInvitationRequest.bind(controller.notificationController))
)

notificationRouter.delete(
    "/:notificationIdx/invitation/reject",
    invitatinonDto.checkRegx([
        ['notificationIdx', regx.idxRegx]
    ]),
    wrapper(controller.notificationController.rejectInvitationRequest.bind(controller.notificationController))
)

export default notificationRouter