import nodemailer from 'nodemailer'
import { sendGmailPassword, sendGmailUser } from '../const/environment'
import { CustomError } from '../exception/customError'

export async function sendInvitatedEmail(fromNickname: string, fromEmail: string, toEmail: string, teamSpaceName: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: sendGmailUser,
            pass: sendGmailPassword
        }
    })

    const mailOptions = {
        from: `${fromNickname} <${fromEmail}>`,
        to: toEmail,
        subject: 'teamSpace에서 초대를 받았습니다.',
        text: `안녕하세요 ${toEmail}님 teamFlow의 ${teamSpaceName}에서 초대를 받았습니다.`,
        html: `<a href="http://localhost:3001/users/google/login">invitation link </a>`
    }

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            const customError = new CustomError()
            throw customError.internalServerErrorException('메일 전송 실패')
        }
    })
}