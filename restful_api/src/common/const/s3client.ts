import { S3Client } from '@aws-sdk/client-s3'
import { s3accessKey, s3secretKey, s3region } from './environment'

export const s3 = new S3Client({
    region: s3region,
    credentials: {
        accessKeyId: s3accessKey,
        secretAccessKey: s3secretKey
    }
})