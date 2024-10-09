import { Router } from 'express'
import { wrapper } from '../../common/utils/wrapper'
import { controller } from '../index.controller'
import { CheckVerifyToken } from '../../common/pipes/checkVerifyToken'
import { TeamSpaceDto } from './dto/teamSpace.dto'
import { regx } from '../../common/const/regx'
import { TSMemberDto } from './dto/tsMember.dto'

const teamSpaceRouter = Router()

const checkVerifyToken = new CheckVerifyToken()
const teamSpaceDto = new TeamSpaceDto()
const tsMemberDto = new TSMemberDto()

teamSpaceRouter.post(
    "/",
    checkVerifyToken.checkVerifyAccessToken(),
    teamSpaceDto.checkRegx([
        ['teamSpaceName', regx.teamSpaceNameRegx]
    ]),
    wrapper(controller.teamSpaceController.addTeamSpace.bind(controller.teamSpaceController))
)

teamSpaceRouter.put(
    "/:teamSpaceIdx",
    checkVerifyToken.checkVerifyAccessToken(),
    teamSpaceDto.checkRegx([
        ['teamSpaceIdx', regx.idxRegx],
        ['teamSpaceName', regx.teamSpaceNameRegx]
    ]),
    wrapper(controller.teamSpaceController.putTeamSpace.bind(controller.teamSpaceController))
)

teamSpaceRouter.delete(
    "/:teamSpaceIdx",
    checkVerifyToken.checkVerifyAccessToken(),
    teamSpaceDto.checkRegx([
        ['teamSpaceIdx', regx.idxRegx]
    ]),
    wrapper(controller.teamSpaceController.deleteTeamSpace.bind(controller.teamSpaceController))
)

teamSpaceRouter.get(
    "/:teamSpaceIdx/user/list",
    checkVerifyToken.checkVerifyAccessToken(),
    teamSpaceDto.checkRegx([
        ['teamSpaceIdx', regx.idxRegx]
    ]),
    wrapper(controller.teamSpaceController.getUserList.bind(controller.teamSpaceController))
)

teamSpaceRouter.put(
    "/:teamSpaceIdx/user/auth",
    checkVerifyToken.checkVerifyAccessToken(),
    tsMemberDto.checkRegx([
        ['teamSpaceIdx', regx.idxRegx],
        ['userIdx', regx.idxRegx],
        ['roleIdx', regx.idxRegx]
    ]),
    wrapper(controller.teamSpaceController.putUserAuth.bind(controller.teamSpaceController))
)

export default teamSpaceRouter