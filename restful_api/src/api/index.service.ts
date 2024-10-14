import { UserService } from "./users/users.service";
import { repository } from "./index.repo";
import pool from "../common/database/postgresql";
import { TeamSpaceService } from "./team-spaces/team-spaces.service";
import { ChannelService } from "./channels/channels.service";
import { InvitationService } from "./invitations/invitations.service";
import client from "../common/database/mongodb";
import { NotificationService } from "./notifications/notifications.service";

const userService = new UserService(repository.userRepository, pool)
const teamSpaceService = new TeamSpaceService(repository.teamSpaceRepository, pool)
const channelService = new ChannelService(repository.teamSpaceRepository, repository.channelRepository, pool)
const invitationService = new InvitationService(repository.invitationRepository, repository.teamSpaceRepository, repository.userRepository, repository.channelRepository, pool, client)
const notificationService = new NotificationService(repository.notificationRepository, repository.userRepository, repository.teamSpaceRepository, repository.channelRepository, pool, client)

export const service = {
    userService,
    teamSpaceService,
    channelService,
    invitationService,
    notificationService
}