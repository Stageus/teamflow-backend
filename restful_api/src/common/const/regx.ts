const nicknameRegx = /^[a-zA-A0-9가-힣\s]{3,10}$/
const idxRegx = /^[0-9]{1,}$/
const teamSpaceNameRegx = /^.{5,20}$/
const channelNameRegx = /^.{5,20}$/

export const regx = {
    nicknameRegx,
    idxRegx,
    teamSpaceNameRegx,
    channelNameRegx
}