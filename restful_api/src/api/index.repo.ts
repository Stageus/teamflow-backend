import { UserRepository } from "./users/dao/users.repo";
import pool from "../common/database/postgresql";
import { TeamSpaceRepository } from "./team-spaces/dao/team-sapces.repo";
import { ChannelRepository } from "./channels/dao/channels.repo";
import { InvitationRepository } from "./invitations/dao/invitations.repo";
import client from "../common/database/mongodb";
import { NotificationRepository } from "./notifications/dao/notifications.repo";

const userRepository = new UserRepository(pool)
const teamSpaceRepository = new TeamSpaceRepository(pool)
const channelRepository = new ChannelRepository(pool)
const invitationRepository = new InvitationRepository(pool, client)
const notificationRepository = new NotificationRepository(pool, client)

export const repository = {
    userRepository,
    teamSpaceRepository,
    channelRepository,
    invitationRepository,
    notificationRepository
}