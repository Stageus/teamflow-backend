import { Pool } from "pg";
import { TeamSpaceRepository } from "./dao/team-sapces.repo";
import { TeamSpaceDto } from "./dto/teamSpace.dto";
import { TeamSpaceEntity } from "./entity/teamSpace.entity";
import { UserDto } from "../users/dto/users.dto";
import { CustomError } from "../../common/exception/customError";
import { TSMemberEntity } from "./entity/tsMember.entity";
import { TSMemberDto } from "./dto/tsMember.dto";
import { generalManager, member, teamManager } from "../../common/const/ts_role";
import { TSParListDetailDto } from "./dto/tsParListDetail.dto";
import { TSMemberDetailDto } from "./dto/tsMemberDetail.dto";

interface ITeamSpaceService {
    createTeamSpace(teamSpaceDto: TeamSpaceDto): Promise<void>
    updateTeamSpace(userDto: UserDto, teamSpaceDto: TeamSpaceDto): Promise<void>
    deleteTeamSpace(userDto: UserDto, teamSpaceDto: TeamSpaceDto): Promise<void> 
    selectUserList(tsMemberDto: TSMemberDto): Promise<TSMemberDetailDto[]> 
    updateUserAuth(userDto: UserDto, tsMemberDto: TSMemberDto): Promise<void>
    deleteTSUser(userDto: UserDto, tsMemberDto: TSMemberDto): Promise<void> 
    selectTSList(tsMemberDto: TSMemberDto): Promise<TSMemberDto[]> 
    selectTSOwnList(teamSpaceDto: TeamSpaceDto): Promise<TSMemberDto[]> 
    selectTSParList(tsMemberDto: TSMemberDto): Promise<TSParListDetailDto[]> 
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
        
        // teamspace general manager가 아닌 경우
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

        // teamspace general manager가 아닌 경우
        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manager만 가능')
        }

        await this.teamSpaceRepository.deleteTeamSpace(teamSpaceEntity, this.pool)
    }

    async selectUserList(tsMemberDto: TSMemberDto): Promise<TSMemberDetailDto[]> {
        const tsMemberEntity = new TSMemberEntity({
            teamSpaceIdx: tsMemberDto.teamSpaceIdx
        })

        const tsMemberList = await this.teamSpaceRepository.getTSMemberList(tsMemberDto.searchWord!, tsMemberEntity, this.pool)

        // teamspace 소속 user가 없는 경우
        if (tsMemberList.length === 0) {
            throw this.customError.notFoundException('해당하는 소속 user 없음')
        }

        return tsMemberList.map(member => new TSMemberDetailDto({
            tsUserIdx: member.user_idx,
            roleIdx: member.ts_role_idx,
            nickname: member.nickname,
            email: member.email,
            profile: member.profile_image
        }))
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

        // teamspace general manager가 아닌 경우
        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manager만 가능')
        }

        await this.teamSpaceRepository.getTSMemberByIdx(tsMemberEntity, this.pool)

        // teamspace 소속 user가 아닌 경우
        if (!tsMemberEntity.roleIdx) {
            throw this.customError.notFoundException('해당 user는 teamspace 소속이 아님')
        }

        // teamManager인 경우 member로, member인 경우 teamManager로 권한 변경
        if (tsMemberEntity.roleIdx === teamManager) {
            return await this.teamSpaceRepository.putManagerAuth(tsMemberEntity, this.pool)
        } else if (tsMemberEntity.roleIdx === member) {
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

        // teamSpace의 general manager가 아닌 경우
        if (userDto.userIdx !== teamSpaceEntity.ownerIdx) {
            throw this.customError.forbiddenException('general manager만 가능')
        }

        await this.teamSpaceRepository.getTSMemberByIdx(tsMemberEntity, this.pool)

        // teamManager인 경우와 member인 경우의 teamspace 소속 user 추방
        if (tsMemberEntity.roleIdx === teamManager) {
            return await this.teamSpaceRepository.deleteManager(tsMemberEntity, this.pool)
        } else if (tsMemberEntity.roleIdx === member) {
            return await this.teamSpaceRepository.deleteMember(tsMemberEntity, this.pool)
        }
    }

    async deleteMeFromTS(userDto: UserDto, tsMemberDto: TSMemberDto): Promise<void> {
        const teamSpaceEntity = new TeamSpaceEntity ({
            teamSpaceIdx: tsMemberDto.teamSpaceIdx
        })

        const tsMemberEntity = new TSMemberEntity({
            teamSpaceIdx: tsMemberDto.teamSpaceIdx,
            tsUserIdx: userDto.userIdx
        })

        await this.teamSpaceRepository.getTeamSpaceOwner(teamSpaceEntity, this.pool)

        // teamSpace의 general manager인 경우
        if (userDto.userIdx === teamSpaceEntity.ownerIdx) {
            await this.teamSpaceRepository.deleteTeamSpace(teamSpaceEntity, this.pool)
        }

        await this.teamSpaceRepository.getTSMemberByIdx(tsMemberEntity, this.pool)

        // teamManager인 경우와 member인 경우의 teamspace 나가기
        if (tsMemberEntity.roleIdx === teamManager) {
            return await this.teamSpaceRepository.deleteManager(tsMemberEntity, this.pool)
        } else if (tsMemberEntity.roleIdx === member) {
            return await this.teamSpaceRepository.deleteMember(tsMemberEntity, this.pool)
        }
    }

    async selectTSList(tsMemberDto: TSMemberDto): Promise<TSMemberDto[]> {
        const tsMemberEntity = new TSMemberEntity({
            tsUserIdx: tsMemberDto.tsUserIdx
        })

        const tsList = await this.teamSpaceRepository.getTSList(tsMemberEntity, this.pool)

        if (tsList.length === 0) {
            throw this.customError.notFoundException('소속된 teamspace가 없음')
        }

        return tsList.map(ts => new TSMemberDto({
            teamSpaceIdx: ts.ts_idx,
            teamSpaceName: ts.ts_name,
            roleIdx: ts.ts_role_idx
        }))
    }

    async selectTSOwnList(teamSpaceDto: TeamSpaceDto): Promise<TSMemberDto[]> {{
        const teamSpaceEntity = new TeamSpaceEntity({
            ownerIdx: teamSpaceDto.ownerIdx,
        })

        const tsOwnList = await this.teamSpaceRepository.getTSOwnList(teamSpaceDto.page!, teamSpaceEntity, this.pool)
        
        // 생성한 teamspace가 없거나 더보기 버튼을 눌렀을 때 더 이상 생성한 teamspace가 없는 경우
        if (tsOwnList.length === 0) {
            throw this.customError.notFoundException('더 이상 생성한 teamspace가 없음')
        }

        return tsOwnList.map(ts => new TSMemberDto({
            teamSpaceIdx: ts.ts_idx,
            teamSpaceName: ts.ts_name,
            roleIdx: generalManager
        })
        )
    }}

    async selectTSParList(tsMemberDto: TSMemberDto): Promise<TSParListDetailDto[]> {
        const tsMemberEntity = new TSMemberEntity({
            tsUserIdx: tsMemberDto.tsUserIdx
        })

        // 참여중인 teamspace가 없거나 더보기 버튼을 눌렀을 때 더 이상 참여중인 teamSpace가 없는 경우
        const tsParList = await this.teamSpaceRepository.getTSParList(tsMemberDto.page!, tsMemberEntity, this.pool)

        if (tsParList.length === 0) {
            throw this.customError.notFoundException('더 이상 참여 중인 teamspace가 없음')
        }

        return tsParList.map(ts => new TSParListDetailDto({
            teamSpaceIdx: ts.ts_idx,
            teamSpaceName: ts.ts_name,
            roleIdx: ts.ts_role_idx,
            generalManagerNickname: ts.nickname,
            generalManagerEmail: ts.email
        }))
    }
}