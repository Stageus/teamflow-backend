import { Pool } from "pg";
import { TSInvitationEntity } from "../entity/tsInvitation.entity";

interface IInvitationRepository {

}

export class InvitationRepository implements IInvitationRepository {
    constructor(
        private readonly pool: Pool
    ){}

    async addTSInvited(tsInvitationEntity: TSInvitationEntity, conn: Pool = this.pool): Promise<void> {
        
    }
}