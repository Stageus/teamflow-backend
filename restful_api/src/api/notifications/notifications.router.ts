import { Router } from 'express'
import { CheckVerifyToken } from '../../common/pipes/checkVerifyToken'
import { regx } from '../../common/const/regx'
import { controller } from '../index.controller'
import { wrapper } from '../../common/utils/wrapper'
<<<<<<< HEAD
import { InvitedNotificationDto } from './dto/invitedNotification.dto'
=======
>>>>>>> master

const notificationRouter = Router()

const checkVerifyToken = new CheckVerifyToken()
<<<<<<< HEAD
const invitatinonDto = new InvitedNotificationDto()
=======
>>>>>>> master

notificationRouter.get(
    "/invitation/list",
    checkVerifyToken.checkVerifyAccessToken(),
    wrapper(controller.notificationController.getInvitationList.bind(controller.notificationController))
)

<<<<<<< HEAD
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

=======
>>>>>>> master
export default notificationRouter