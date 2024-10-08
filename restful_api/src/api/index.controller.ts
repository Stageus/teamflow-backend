import { UserController } from "./users/users.controller";
import { service } from "./index.service";
import { TeamSpaceController } from "./team-spaces/team-spaces.controller";

const userController = new UserController(service.userService)
const teamSpaceController = new TeamSpaceController(service.teamSpaceService)

export const controller = {
    userController,
    teamSpaceController
}