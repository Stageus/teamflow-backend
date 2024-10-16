import nodemailer from 'nodemailer'
import { sendGmailPassword, sendGmailUser } from '../const/environment'
import { TSInvitationDto } from '../../api/invitations/dto/tsInvitation.dto'
import { CustomError } from '../exception/customError'
import { NextFunction, Request } from 'express'

interface ISendMail {
    sendInvitatedEmail(tsInvitationDto: TSInvitationDto): Promise<(req: Request, res: Response, next: NextFunction) => Promise<void>>
}

export class SendMail implements ISendMail {
    private customError: CustomError

    constructor() {
        this.customError = new CustomError()
    }

    async sendInvitatedEmail(tsInvitationDto: TSInvitationDto): Promise<(req: Request, res: Response, next: NextFunction) => Promise<void>> {
        return async (req, res, next) =>  {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: false,
                auth: {
                    user: sendGmailUser,
                    pass: sendGmailPassword
                }
            })

            const mailOptions = {
                from: `<${sendGmailUser}>`,
                to: tsInvitationDto.toEmail,
                subject: '팀스페이스 초대 알림',
                text: `안녕하세요 ${tsInvitationDto.toEmail}님,\n\n${tsInvitationDto.sendEmail}님에게 ${tsInvitationDto.teamSpaceName} 팀으로 초대를 받았습니다.\n\n자세한 내용은 아래 링크를 클릭해 주세요.`,
                html: `<p>안녕하세요 ${tsInvitationDto.toEmail}님,</p>
                    <p> ${tsInvitationDto.sendEmail}님으로부터 </p>
                    <p>teanFlow의 ${tsInvitationDto.teamSpaceName} 팀에 초대를 받았습니다.</p>
                    <p><a href="http://localhost:3001/users/google/login" style="color: blue; text-decoration: underline;">초대 링크</a></p>
                    <p>감사합니다!</p>`,
                replyTo: tsInvitationDto.sendEmail
            }

            try {
                await transporter.sendMail(mailOptions)
            } catch (err) {
                next(this.customError.internalServerErrorException('mail 전송 실패'))
            }
        }
    }
}
