import { Router } from "express";
import { wrapper } from "../../common/custom/wrapper";
import { controller } from "../index.controller";
import { CheckVerifyToken } from "../../common/pipes/checkVerifyToken";
import { UserDto } from "./dto/users.dto";
import { regx } from "../../common/const/regx";

const userRouter = Router()

const checkVerifyToken = new CheckVerifyToken()
const userDto = new UserDto()

userRouter.get(
    "/google/login",
    wrapper(controller.userController.googleLogin.bind(controller.userController))
)

userRouter.get(
    "/google/login/callback",
    wrapper(controller.userController.googleLoginCallback.bind(controller.userController))
)

userRouter.post(
    "/", 
    checkVerifyToken.checkVerifySignUpToken(),
    userDto.checkRegx([
        ['nickname', regx.nicknameRegx]
    ]),
    wrapper(controller.userController.signUp.bind(controller.userController))
)

userRouter.get(
    "/",
    checkVerifyToken.checkVerifyAccessToken(),
    wrapper(controller.userController.getUserInfo.bind(controller.userController))
)

userRouter.put(
    "/profile-image",
    checkVerifyToken.checkVerifyAccessToken(),
    wrapper(controller.userController.putProfileImage.bind(controller.userController))
)

userRouter.put(
    "/nickname",
    checkVerifyToken.checkVerifyAccessToken(),
    userDto.checkRegx([
        ['nickname', regx.nicknameRegx]
    ]),
    wrapper(controller.userController.putNickname.bind(controller.userController))
)

userRouter.delete(
    "/",
    checkVerifyToken.checkVerifyAccessToken(),
    wrapper(controller.userController.withdrawal.bind(controller.userController))
)

export default userRouter