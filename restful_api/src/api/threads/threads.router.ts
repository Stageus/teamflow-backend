import { Router } from "express";
import { CheckVerifyToken } from "../../common/pipes/checkVerifyToken";
import { regx } from "../../common/const/regx";
import { controller } from "../index.controller";
import { wrapper } from "../../common/utils/wrapper";
import { ThreadsDto } from "./dto/threads.dto";

const threadRouter = Router()

const checkVerifyToken = new CheckVerifyToken()
const threadDto = new ThreadsDto()

threadRouter.get(
    "/list",
    checkVerifyToken.checkVerifyAccessToken(),
    threadDto.checkRegx([
        ['channelIdx', regx.idxRegx]
    ]),
    wrapper(controller.threadController.getThreadList.bind(controller.threadController))
)

export default threadRouter