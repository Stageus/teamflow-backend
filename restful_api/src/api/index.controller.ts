import { UserController } from "./users/users.controller";
import { service } from "./index.service";
import { TeamSpaceController } from "./team-spaces/team-spaces.controller";
import { ChannelController } from "./channels/channels.controller";
import { InvitationController } from "./invitations/invitations.controller";

const userController = new UserController(service.userService)
const teamSpaceController = new TeamSpaceController(service.teamSpaceService)
const channelController = new ChannelController(service.channelService)
const invitationController = new InvitationController(service.invitationService)

export const controller = {
    userController,
    teamSpaceController,
    channelController,
    invitationController
}