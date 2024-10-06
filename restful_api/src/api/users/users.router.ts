import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper.util";
import { controller } from "../index.controller";

const userRouter = Router()

userRouter.get(
    "/google/login",
    wrapper(controller.userController.googleLogin.bind(controller.userController))
)

userRouter.get(
    "/google/login/callback",
    wrapper(controller.userController.googleLoginCallback.bind(controller.userController))
)

export default userRouter