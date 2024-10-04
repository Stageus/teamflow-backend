import { google } from 'googleapis'
import { googleClientId, googleClientSecret, googleRedirectUrl } from './environment'

export const ouath2Client = new google.auth.OAuth2(
    googleClientId,
    googleClientSecret,
    googleRedirectUrl
)