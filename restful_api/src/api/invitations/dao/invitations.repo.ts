import { Pool } from "pg";

interface IInvitationRepository {

}

export class InvitationRepository implements IInvitationRepository {
    constructor(
        private readonly pool: Pool
    ){}
}