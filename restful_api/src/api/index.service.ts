import { UserService } from "./users/users.service";
import { repository } from "./index.repo";
import pool from "../common/database/postgresql";
import { TeamSpaceService } from "./team-spaces/team-spaces.service";

const userService = new UserService(repository.userRepository, pool)
const teamSpaceService = new TeamSpaceService(repository.teamSpaceRepository, pool)

export const service = {
    userService,
    teamSpaceService
}