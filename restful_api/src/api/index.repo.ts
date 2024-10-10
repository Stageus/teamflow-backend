import { UserRepository } from "./users/dao/users.repo";
import pool from "../common/database/postgresql";
import { TeamSpaceRepository } from "./team-spaces/dao/team-sapces.repo";
import { ChannelRepository } from "./channels/dao/channels.repo";

const userRepository = new UserRepository(pool)
const teamSpaceRepository = new TeamSpaceRepository(pool)
const channelRepository = new ChannelRepository(pool)

export const repository = {
    userRepository,
    teamSpaceRepository,
    channelRepository
}