import { Pool } from "pg";
import { TeamSpaceRepository } from "./dao/team-sapces.repo";
import { TeamSpaceDto } from "./dto/teamSpace.dto";
import { TeamSpaceEntity } from "./entity/teamSpace.entity";
import { UserDto } from "../users/dto/users.dto";
import { CustomError } from "../../common/exception/customError";
import { TSMemberEntity } from "./entity/tsMember.entity";
import { TSMemberDto } from "./dto/tsMember.dto";
import { member, teamManager } from "../../common/const/ts_role";
import { TSMemberDetailEntity } from "./entity/tsMemberDetail.entity";
import { TSParListDetailEntity } from "./entity/tsParListDetail.entity";

interface ITeamSpaceService {
    createTeamSpace(teamSpaceDto: TeamSpaceDto): Promise<void>
    updateTeamSpace(userDto: UserDto, teamSpaceDto: TeamSpaceDto): Promise<void>
    deleteTeamSpace(userDto: UserDto, teamSpaceDto: TeamSpaceDto): Promise<void> 
    selectUserList(tsMemberDto: TSMemberDto): Promise<TSMemberDetailEntity[]> 
    updateUserAuth(userDto: UserDto, tsMemberDto: TSMemberDto): Promise<void>
    deleteTSUser(userDto: UserDto, tsMemberDto: TSMemberDto): Promise<void> 
    selectTSList(tsMemberDto: TSMemberDto): Promise<TSMemberEntity[]> 
    selectTSOwnList(teamSpaceDto: TeamSpaceDto): Promise<TSMemberEntity[]> 
    selectTSParList(tsMemberDto: TSMemberDto): Promise<TSParListDetailEntity[]> 
}

export class TeamSpaceService implements ITeamSpaceService {
    private customError: CustomError

    constructor (
        private readonly teamSpaceRepository : TeamSpaceRepository,
        private readonly pool : Pool
    ) {
        this.customError = new CustomError()
    }

    async createTeamSpace(teamSpaceDto: TeamSpaceDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity({
            ownerIdx: teamSpaceDto.ownerIdx,
            teamSpaceName: teamSpaceDto.teamSpaceName
        })

        await this.teamSpaceRepository.addTeamSpace(teamSpaceEntity, this.pool) 
    }

    async updateTeamSpace(userDto: UserDto, teamSpaceDto: TeamSpaceDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity({
            teamSpaceIdx: teamSpaceDto.teamSpaceIdx,
            teamSpaceName: teamSpaceDto.teamSpaceName
        })

        await this.teamSpaceRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manager만 가능')
        }

        await this.teamSpaceRepository.putTeamSpaceName(teamSpaceEntity, this.pool)
    }

    async deleteTeamSpace(userDto: UserDto, teamSpaceDto: TeamSpaceDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity({
            teamSpaceIdx: teamSpaceDto.teamSpaceIdx
        })

        await this.teamSpaceRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manager만 가능')
        }

        await this.teamSpaceRepository.deleteTeamSpace(teamSpaceEntity, this.pool)
    }

    async selectUserList(tsMemberDto: TSMemberDto): Promise<TSMemberDetailEntity[]> {
        const tsMemberEntity = new TSMemberEntity({
            teamSpaceIdx: tsMemberDto.teamSpaceIdx
        })

        const tsMemberList = await this.teamSpaceRepository.getTSMemberList(tsMemberDto.searchWord!, tsMemberEntity, this.pool)

        if (tsMemberList.length === 0) {
            throw this.customError.notFoundException('해당하는 소속 user 없음')
        }

        return tsMemberList
    }

    async updateUserAuth(userDto: UserDto, tsMemberDto: TSMemberDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity({
            teamSpaceIdx: tsMemberDto.teamSpaceIdx
        })

        const tsMemberEntity = new TSMemberEntity({
            teamSpaceIdx: tsMemberDto.teamSpaceIdx,
            tsUserIdx: tsMemberDto.tsUserIdx
        })

        await this.teamSpaceRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manager만 가능')
        }

        await this.teamSpaceRepository.getTSMemberByIdx(tsMemberEntity, this.pool)

        if (!tsMemberEntity.roleIdx) {
            throw this.customError.notFoundException('해당 user는 teamspace 소속이 아님')
        }

        if (tsMemberEntity.roleIdx === teamManager) {
            return await this.teamSpaceRepository.putManagerAuth(tsMemberEntity, this.pool)
        }

        if (tsMemberEntity.roleIdx === member) {
            return await this.teamSpaceRepository.putMemberAuth(tsMemberEntity, this.pool)
        }
    }

    async deleteTSUser(userDto: UserDto, tsMemberDto: TSMemberDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity ({
            teamSpaceIdx: tsMemberDto.teamSpaceIdx
        })

        const tsMemberEntity = new TSMemberEntity({
            teamSpaceIdx: tsMemberDto.teamSpaceIdx,
            tsUserIdx: tsMemberDto.tsUserIdx
        })

        await this.teamSpaceRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manager만 가능')
        }

        await this.teamSpaceRepository.getTSMemberByIdx(tsMemberEntity, this.pool)

        if (tsMemberEntity.roleIdx === teamManager) {
            return await this.teamSpaceRepository.deleteManager(tsMemberEntity, this.pool)
        }

        if (tsMemberEntity.roleIdx === member) {
            return await this.teamSpaceRepository.deleteMember(tsMemberEntity, this.pool)
        }
    }

    async selectTSList(tsMemberDto: TSMemberDto): Promise<TSMemberEntity[]> {
        const tsMemberEntity = new TSMemberEntity({
            tsUserIdx: tsMemberDto.tsUserIdx
        })

        const tsList = await this.teamSpaceRepository.getTSList(tsMemberEntity, this.pool)

        if (tsList.length === 0) {
            throw this.customError.notFoundException('소속된 teamspace가 없음')
        }

        return tsList
    }

    async selectTSOwnList(teamSpaceDto: TeamSpaceDto): Promise<TSMemberEntity[]> {{
        const teamSpaceEntity = new TeamSpaceEntity({
            ownerIdx: teamSpaceDto.ownerIdx,
        })

        const tsOwnList = await this.teamSpaceRepository.getTSOwnList(teamSpaceDto.page!, teamSpaceEntity, this.pool)
        
        if (tsOwnList.length === 0) {
            throw this.customError.notFoundException('더 이상 생성한 teamspace가 없음')
        }

        return tsOwnList
    }}

    async selectTSParList(tsMemberDto: TSMemberDto): Promise<TSParListDetailEntity[]> {
        const tsMemberEntity = new TSMemberEntity({
            tsUserIdx: tsMemberDto.tsUserIdx
        })

        const tsParList = await this.teamSpaceRepository.getTSParList(tsMemberDto.page!, tsMemberEntity, this.pool)

        if (tsParList.length === 0) {
            throw this.customError.notFoundException('더 이상 참여 중인 teamspace가 없음')
        }

        return tsParList
    }
}