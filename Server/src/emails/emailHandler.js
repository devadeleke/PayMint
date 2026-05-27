import { ResendClient, Sender } from '../config/resend.js'
import { generateVerificationEmail } from './emailTemplate.js';

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