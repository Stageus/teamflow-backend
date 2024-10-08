import { Router } from 'express'
import { wrapper } from '../../common/utils/wrapper'
import { controller } from '../index.controller'
import { CheckVerifyToken } from '../../common/pipes/checkVerifyToken'
import { TeamSpaceDto } from './dto/team-spaes.dto'
import { regx } from '../../common/const/regx'

const teamSpaceRouter = Router()

const checkVerifyToken = new CheckVerifyToken()
const teamSpaceDto = new TeamSpaceDto()

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

export default teamSpaceRouter