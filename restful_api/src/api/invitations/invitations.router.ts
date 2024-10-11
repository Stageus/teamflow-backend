import { Router } from 'express'
import { CheckVerifyToken } from '../../common/pipes/checkVerifyToken'
import { TSInvitationDto } from './dto/tsInvitation.dto'
import { ChInvitationDto } from './dto/chInvitation.dto'
import { regx } from '../../common/const/regx'
import { controller } from '../index.controller'
import { wrapper } from '../../common/custom/wrapper'

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

export default invitationRouter