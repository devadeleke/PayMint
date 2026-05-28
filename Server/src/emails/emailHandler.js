import { ResendClient, Sender } from '../config/resend.js'
import { generateVerificationEmail, sendWelcomeEmailTemplate, sendPasswordResetEmailTemplate } from './emailTemplate.js';

export const sendVerificationEmail = (email, fullName, verificationToken, verificationTokenExpiry) => {
(async function () {
  const { data, error } = await ResendClient.emails.send({
    from: `${Sender.name} <${Sender.email}>`,
    to: email,
    subject: 'Hello World',
    html: generateVerificationEmail({ name: fullName, code: verificationToken })?.html,
    category: 'verification',
    metadata: {
        userEmail: email,
        userId: verificationToken
    }
    });

    if (error) {
        return console.error({ error });
    }

  console.log({ data });
})()
}

export const sendWelcomeEmail = (email, fullName, appUrl) => {
    (async function () {
      const { data, error } = await ResendClient.emails.send({
        from: `${Sender.name} <${Sender.email}>`,
        to: email,
        subject: 'Welcome to PayPing!',
        html: sendWelcomeEmailTemplate({ email, fullName, appUrl })?.html,
        category: 'welcome',
        metadata: {
            userEmail: email,
        }
        });
      })()
}

export const sendPasswordResetEmail = (name, email, resetUrl) => {
  (async function () {
      const { data, error } = await ResendClient.emails.send({
        from: `${Sender.name} <${Sender.email}>`,
        to: email,
        subject: 'Reset Your Password',
        html: sendPasswordResetEmailTemplate({ name, email, resetUrl })?.html,
        category: 'password-reset',
        metadata: {
            userEmail: email,
        }
        });
      })()
}