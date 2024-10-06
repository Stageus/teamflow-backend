import { UserController } from "./users/users.controller";
import { service } from "./index.service";

const userController = new UserController(service.userService)

export const controller = {
    userController
}