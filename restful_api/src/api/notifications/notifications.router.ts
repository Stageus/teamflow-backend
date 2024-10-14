import { Router } from 'express'
import { CheckVerifyToken } from '../../common/pipes/checkVerifyToken'
import { regx } from '../../common/const/regx'
import { controller } from '../index.controller'
import { wrapper } from '../../common/utils/wrapper'

const notificationRouter = Router()

const checkVerifyToken = new CheckVerifyToken()

notificationRouter.get(
    "/invitation/list",
    checkVerifyToken.checkVerifyAccessToken(),
    wrapper(controller.notificationController.getInvitationList.bind(controller.notificationController))
)

export default notificationRouter