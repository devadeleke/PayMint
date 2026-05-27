
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
                    ©PayMint. All rights reserved.
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

    ©PayMint. All rights reserved.
    `;

    return { html, text };
    };

{/* <td style="padding-left: 8px;">
    <p style="margin: 0; font-size: 13px; color: #64748B; line-height: 1.5;">
    This code expires in <strong style="color: #0F172A;">${expiry} minutes</strong>. If it expires, you can request a new one from the app.
    </p>
    This code expires in ${expiry} minutes. If it expires, you can request a new one from the app.
</td> */}

/**
 * Generates the email verified confirmation email
 * @param {Object} params
 * @param {string} params.name - User's full name
 * @param {string} params.email - User's email address
 * @param {string} params.dashboardUrl - URL to the user's dashboard
 * @returns {{ html: string, text: string }} - An object containing the HTML and plain text versions of the email
 */
export const sendWelcomeEmailTemplate = ({ email, name, dashboardUrl }) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verified - PayMint</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 40px 0;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 48px 0 48px; text-align: left;">
              <div style="font-size: 24px; font-weight: 700; color: #4F46E5; letter-spacing: -0.5px;">
                ⚡ PayMint
              </div>
            </td>
          </tr>

          <!-- Success Icon & Main Content -->
          <tr>
            <td style="padding: 32px 48px 0 48px; text-align: center;">
              <!-- Success Checkmark -->
              <div style="display: inline-block; width: 64px; height: 64px; background-color: #ECFDF5; border-radius: 50%; margin-bottom: 24px;">
                <table role="presentation" width="64" height="64" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" valign="middle">
                      <span style="font-size: 32px;">✅</span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #0F172A; line-height: 1.3;">
                Email verified successfully!
              </h1>
              
              <p style="margin: 12px 0 0 0; font-size: 15px; color: #475569; line-height: 1.6;">
                Hey ${name},<br><br>
                Your email <strong style="color: #0F172A;">${email}</strong> has been verified. Your PayMint account is now fully activated and ready to use.
              </p>
            </td>
          </tr>

          <!-- What's Next Section -->
          <tr>
            <td style="padding: 28px 48px 0 48px;">
              <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #0F172A;">
                What's next?
              </h2>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                
                <!-- Step 1 -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; height: 32px; background-color: #EEF2FF; border-radius: 8px; text-align: center; vertical-align: middle;">
                          <span style="font-size: 14px; color: #4F46E5; font-weight: 700;">1</span>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">
                            <strong style="color: #0F172A;">Set up your business profile</strong><br>
                            <span style="color: #64748B;">Add your logo, business name, and payment details.</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 2 -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; height: 32px; background-color: #EEF2FF; border-radius: 8px; text-align: center; vertical-align: middle;">
                          <span style="font-size: 14px; color: #4F46E5; font-weight: 700;">2</span>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">
                            <strong style="color: #0F172A;">Add your clients</strong><br>
                            <span style="color: #64748B;">Import or manually add the clients you work with.</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Step 3 -->
                <tr>
                  <td style="padding-bottom: 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; height: 32px; background-color: #EEF2FF; border-radius: 8px; text-align: center; vertical-align: middle;">
                          <span style="font-size: 14px; color: #4F46E5; font-weight: 700;">3</span>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">
                            <strong style="color: #0F172A;">Create your first invoice</strong><br>
                            <span style="color: #64748B;">Send professional invoices and get paid online.</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 32px 48px 0 48px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" style="display: inline-block; background-color: #4F46E5; color: #FFFFFF; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; text-align: center;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Account Info Box -->
          <tr>
            <td style="padding: 24px 48px 0 48px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F0FDF4; border-radius: 8px; border: 1px solid #BBF7D0;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align: top; width: 20px; padding-top: 1px;">
                          <span style="font-size: 14px;">🔐</span>
                        </td>
                        <td style="padding-left: 10px;">
                          <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
                            <strong>Your account is secure</strong><br>
                            <span style="color: #15803D;">Verified email: ${email}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Quick Links -->
          <tr>
            <td style="padding: 28px 48px 0 48px;">
              <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px;">
                Quick Links
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right: 24px;">
                    <a href="${dashboardUrl}" style="font-size: 13px; color: #4F46E5; text-decoration: none;">Dashboard</a>
                  </td>
                  <td style="padding-right: 24px;">
                    <a href="${dashboardUrl}/invoices/new" style="font-size: 13px; color: #4F46E5; text-decoration: none;">New Invoice</a>
                  </td>
                  <td style="padding-right: 24px;">
                    <a href="${dashboardUrl}/clients" style="font-size: 13px; color: #4F46E5; text-decoration: none;">Clients</a>
                  </td>
                  <td>
                    <a href="${dashboardUrl}/settings" style="font-size: 13px; color: #4F46E5; text-decoration: none;">Settings</a>
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
                Need help getting started? Check out our <a href="${dashboardUrl}/help" style="color: #4F46E5; text-decoration: none;">Help Center</a> or reply to this email.
              </p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #94A3B8; line-height: 1.5;">
                You're receiving this email because you verified your email address on PayMint.
              </p>
              <p style="margin: 16px 0 0 0; font-size: 11px; color: #CBD5E1;">
                ©PayMint. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

    // Plain text fallback
    const text = `
✅ Email Verified Successfully - PayMint

Hey ${name},

Your email ${email} has been verified. Your PayMint account is now fully activated and ready to use.

WHAT'S NEXT?

1. Set up your business profile
   Add your logo, business name, and payment details.

2. Add your clients
   Import or manually add the clients you work with.

3. Create your first invoice
   Send professional invoices and get paid online.

→ Go to Dashboard: ${dashboardUrl}

Your account is secure
Verified email: ${email}

QUICK LINKS
• Dashboard: ${dashboardUrl}
• New Invoice: ${dashboardUrl}/invoices/new
• Clients: ${dashboardUrl}/clients
• Settings: ${dashboardUrl}/settings

Need help getting started? Check out our Help Center or reply to this email.

You're receiving this email because you verified your email address on PayMint.

©PayMint. All rights reserved.
`;

    return { html, text };
};