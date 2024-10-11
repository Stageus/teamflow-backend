import { Router } from 'express'
import { wrapper } from '../../common/utils/wrapper'
import { controller } from '../index.controller'
import { CheckVerifyToken } from '../../common/pipes/checkVerifyToken'
import { ChannelDto } from './dto/channel.dto'
import { regx } from '../../common/const/regx'
import { ChannelMemberDto } from './dto/channelMember.dto'

const channelRouter = Router()

const checkVerifyToken = new CheckVerifyToken()
const channelDto = new ChannelDto()
const channelMemberDto = new ChannelMemberDto()

channelRouter.post(
    "/",
    checkVerifyToken.checkVerifyAccessToken(),
    channelDto.checkRegx([
        ["teamSpaceIdx", regx.idxRegx],
        ["channelName", regx.channelNameRegx]
    ]),
    wrapper(controller.channelController.addChannel.bind(controller.channelController))
)

channelRouter.put(
    "/:channelIdx",
    checkVerifyToken.checkVerifyAccessToken(),
    channelDto.checkRegx([
        ["channelIdx", regx.idxRegx],
        ["channelName", regx.channelNameRegx]
    ]),
    wrapper(controller.channelController.putChannelName.bind(controller.channelController))
)

channelRouter.delete(
    "/:channelIdx",
    checkVerifyToken.checkVerifyAccessToken(),
    channelDto.checkRegx([
        ["channelIdx", regx.idxRegx]
    ]),
    wrapper(controller.channelController.deleteChannel.bind(controller.channelController))
)

channelRouter.delete(
    "/:channelIdx/user",
    checkVerifyToken.checkVerifyAccessToken(),
    channelMemberDto.checkRegx([
        ["channelIdx", regx.idxRegx],
        ["channelUserIdx", regx.idxRegx]
    ]),
    wrapper(controller.channelController.deleteChannelUser.bind(controller.channelController))
)

channelRouter.get(
    "/:channelIdx/user/list",
    checkVerifyToken.checkVerifyAccessToken(),
    channelMemberDto.checkRegx([
        ["channelIdx", regx.idxRegx]
    ]),
    wrapper(controller.channelController.getChannelUserList.bind(controller.channelController))
)

channelRouter.put(
    "/:channelIdx/manager",
    checkVerifyToken.checkVerifyAccessToken(),
    channelMemberDto.checkRegx([
        ["channelIdx", regx.idxRegx ],
        ["channelUserIdx", regx.idxRegx]
    ]),
    wrapper(controller.channelController.putChannelManager.bind(controller.channelController))
)

channelRouter.get(
    "/list",
    checkVerifyToken.checkVerifyAccessToken(),
    channelDto.checkRegx([
        ["teamSpaceIdx", regx.idxRegx]
    ]),
    wrapper(controller.channelController.getChannelList.bind(controller.channelController))
)

export default channelRouter