export const serverPort = process.env.PORT!

export const googleClientId = process.env.GOOGLE_CLIENT_ID!
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!
export const googleRedirectUrl = process.env.GOOGLE_REDIRECT_URL!

export const pgID = process.env.PG_ID!
export const pgPW = process.env.PG_PW!
export const pgHost = process.env.PG_HOST!
export const pgPort = process.env.PG_PORT!
export const pgDatabase = process.env.PG_DATABASE!
export const pgPoolMax = 5

export const jwtSignUpSecretKey = process.env.JWT_SIGN_UP_SECRET_KEY!
export const jwtAccessSecretKey = process.env.JWT_ACCESS_SECRET_KEY!
export const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY!

export const s3accessKey = process.env.S3_ACCESS_KEY!
export const s3secretKey = process.env.S3_SECRET_KEY!
export const s3region = process.env.S3_REGION!
export const s3bucketName = process.env.S3_BUCKET_NAME!

export const sendGmailUser = process.env.SEND_EMAIL_USER!
export const sendGmailPassword = process.env.SEND_GMAIL_PASSWORD!