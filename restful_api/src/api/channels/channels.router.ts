import { Router } from 'express'
import { wrapper } from '../../common/utils/wrapper'
import { controller } from '../index.controller'
import { CheckVerifyToken } from '../../common/pipes/checkVerifyToken'
import { ChannelDto } from './dto/channel.dto'
import { regx } from '../../common/const/regx'

const channelRouter = Router()

const checkVerifyToken = new CheckVerifyToken()
const channelDto = new ChannelDto()

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

export default channelRouter