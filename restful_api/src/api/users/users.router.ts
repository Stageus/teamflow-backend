import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper.util";

const userRouter = Router()

userRouter.post(
    "/google/login",
)

export default userRouter