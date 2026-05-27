import { Resend } from 'resend';
import { ENV } from './env.js'

export const ResendClient = new Resend(ENV.RESEND_API_KEY)
export const Sender = {
    email: ENV.EMAIL_FROM,
    name: ENV.EMAIL_FROM_NAME
}