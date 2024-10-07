import { CustomError } from '../exception/customError'
import multer, { FileFilterCallback } from 'multer' 
import multerS3 from 'multer-s3'
import { s3 } from '../const/s3client'
import { s3bucketName } from '../const/environment'
import { v4 as uuidv4 } from 'uuid'
import { Request } from 'express'

const customError = new CustomError()

type FileNameCallback = (error: Error | null, filename: string) => void

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: s3bucketName,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function(
            req: Request,
            file: Express.Multer.File,
            cb: FileNameCallback
        ) {
            cb(null, `${uuidv4()}_${file.originalname}`)
        }
    }),
    fileFilter(
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) {
        const type = file.mimetype.split("/")[1]

        if (type !== "jpg" && type !== "jpeg" && type !== "png") {
            cb(customError.badRequestException('파일 형식 확인 필요'))
        } else {
            cb(null, true)
        }
    },
    limits: { fileSize: 30 * 1024 }
})