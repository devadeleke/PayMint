
export const generateVerificationEmail = ({ name, code }) => {
  const currentYear = new Date().getFullYear();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - PayMint</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    
    <!-- Outer Wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 40px 0;">
        <tr>
        <td align="center">
            
            <!-- Main Container -->
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);">
            
            <!-- Header with Logo -->
            <tr>
                <td style="padding: 40px 48px 0 48px; text-align: left;">
                <div style="font-size: 24px; font-weight: 700; color: #4F46E5; letter-spacing: -0.5px;">
                    ⚡ PayMint
                </div>
                </td>
            </tr>

            <!-- Hero / Main Content -->
            <tr>
                <td style="padding: 32px 48px 0 48px;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #0F172A; line-height: 1.3;">
                    Verify your email address
                </h1>
                <p style="margin: 12px 0 0 0; font-size: 15px; color: #475569; line-height: 1.6;">
                    Hey ${name || 'there'},<br><br>
                    Thanks for signing up for PayMint. To complete your account setup, use the verification code below.
                </p>
                </td>
            </tr>

            <!-- Verification Code Box -->
            <tr>
                <td style="padding: 32px 48px;">
                <div style="background-color: #F1F5F9; border-radius: 10px; padding: 24px; text-align: center; border: 1px solid #E2E8F0;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 1.5px;">
                    Verification Code
                    </p>
                    <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 40px; font-weight: 700; color: #4F46E5; letter-spacing: 12px; padding-left: 12px;">
                    ${code}
                    </div>
                </div>
                </td>
            </tr>

            <!-- Timer & Additional Info -->
            <tr>
                <td style="padding: 0 48px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                    <td style="vertical-align: top; width: 24px;">
                        <span style="display: inline-block; width: 20px; height: 20px; text-align: center;">⏳</span>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>

            <!-- Security Note -->
            <tr>
                <td style="padding: 16px 48px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                    <td style="vertical-align: top; width: 24px;">
                        <span style="display: inline-block; width: 20px; height: 20px; text-align: center;">🔒</span>
                    </td>
                    <td style="padding-left: 8px;">
                        <p style="margin: 0; font-size: 13px; color: #64748B; line-height: 1.5;">
                        If you didn't create a PayMint account, you can safely ignore this email.
                        </p>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>

            <!-- Divider -->
            <tr>
                <td style="padding: 24px 48px;">
                <div style="border-top: 1px solid #E2E8F0;"></div>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding: 0 48px 40px 48px;">
                <p style="margin: 0; font-size: 12px; color: #94A3B8; line-height: 1.5;">
                    Need help? Reply to this email or contact us at <a href="mailto:support@PayMint.co" style="color: #4F46E5; text-decoration: none;">support@PayMint.co</a>
                </p>
                <p style="margin: 16px 0 0 0; font-size: 11px; color: #CBD5E1;">
                    © ${currentYear} PayMint. All rights reserved.
                </p>
                </td>
            </tr>

            </table>

        </td>
        </tr>
    </table>

    </body>
    </html>`;

    // Plain text fallback (for email clients that don't render HTML)
    const text = `
    Verify Your Email - PayMint

    Hey ${name || 'there'},

    Thanks for signing up for PayMint. To complete your account setup, use the verification code below.

    VERIFICATION CODE: ${code}

    If you didn't create a PayMint account, you can safely ignore this email.

    Need help? Reply to this email or contact us at support@PayMint.co

    © ${currentYear} PayMint. All rights reserved.
    `;

    return { html, text };
    };

{/* <td style="padding-left: 8px;">
    <p style="margin: 0; font-size: 13px; color: #64748B; line-height: 1.5;">
    This code expires in <strong style="color: #0F172A;">${expiry} minutes</strong>. If it expires, you can request a new one from the app.
    </p>
    This code expires in ${expiry} minutes. If it expires, you can request a new one from the app.
</td> */}