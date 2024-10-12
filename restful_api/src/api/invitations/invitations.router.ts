import { Router } from 'express'
import { CheckVerifyToken } from '../../common/pipes/checkVerifyToken'
import { TSInvitationDto } from './dto/tsInvitation.dto'
import { ChInvitationDto } from './dto/chInvitation.dto'
import { regx } from '../../common/const/regx'
import { controller } from '../index.controller'
import { wrapper } from '../../common/utils/wrapper'

const invitationRouter = Router()

const checkVerifyToken = new CheckVerifyToken()
const tsInvitationDto = new TSInvitationDto()
const chInvitationDto = new ChInvitationDto()

invitationRouter.post(
    "/team-space",
    checkVerifyToken.checkVerifyAccessToken(),
    tsInvitationDto.checkRegx([
        ['teamSpaceIdx', regx.idxRegx],
        ['email', regx.emailRegx]
    ]),
    wrapper(controller.invitationController.addTSInvited.bind(controller.invitationController))
)

invitationRouter.post(
    "/channel",
    checkVerifyToken.checkVerifyAccessToken(),
    chInvitationDto.checkRegx([
        ['channelIdx', regx.idxRegx],
        ['channelUserIdx', regx.idxRegx]
    ]),
    wrapper(controller.invitationController.addChannelInvited.bind(controller.invitationController))
)

export default invitationRouter