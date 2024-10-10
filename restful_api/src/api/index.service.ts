import { UserService } from "./users/users.service";
import { repository } from "./index.repo";
import pool from "../common/database/postgresql";
import { TeamSpaceService } from "./team-spaces/team-spaces.service";
import { ChannelService } from "./channels/channels.service";

const userService = new UserService(repository.userRepository, pool)
const teamSpaceService = new TeamSpaceService(repository.teamSpaceRepository, pool)
const channelService = new ChannelService(repository.teamSpaceRepository, repository.channelRepository, pool)

export const service = {
    userService,
    teamSpaceService,
    channelService
}