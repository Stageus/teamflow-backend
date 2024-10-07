import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper";
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
    checkVerifyToken.checkSignUpToken(),
    userDto.checkRegx([
        ['nickname', regx.nicknameRegx]
    ]),
    wrapper(controller.userController.signUp.bind(controller.userController))
)

export default userRouter