import nodemailer from 'nodemailer';

/**
 * @desc    Create email transporter
 * @returns {Object} Nodemailer transporter
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

/**
 * @desc    Send email using nodemailer
 * @param   {Object} options - Email options
 * @param   {string} options.to - Recipient email address
 * @param   {string} options.subject - Email subject
 * @param   {string} options.text - Plain text email content
 * @param   {string} options.html - HTML email content (optional)
 * @returns {Promise} Returns promise with send result
 */
export const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"HRMS System" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html || options.text
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email sent successfully:', info.messageId);
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

/**
 * @desc    Send admin signup credentials email
 * @param   {string} email - Admin email address
 * @param   {string} name - Admin name
 * @param   {string} loginId - Generated login ID
 * @param   {string} password - Admin password (plain text)
 * @param   {string} companyName - Company name
 * @returns {Promise}
 */
export const sendAdminSignupEmail = async (email, name, loginId, password, companyName) => {
    const subject = `🎉 Welcome to ${companyName} HRMS - Your Admin Credentials`;
    
    const text = `
Dear ${name},

Welcome to ${companyName} HRMS System!

Your admin account has been successfully created. Below are your login credentials:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOGIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Login ID: ${loginId}
Password: ${password}
Email: ${email}
Role: Administrator

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please login to the system using these credentials and keep them secure.

IMPORTANT: Store these credentials in a safe place. You can change your password after logging in.

Best regards,
${companyName} HRMS Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated email. Please do not reply.
    `.trim();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${companyName} HRMS</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                🎉 Welcome to ${companyName}
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                                Your HRMS Admin Account is Ready
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                Dear <strong>${name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #555555; font-size: 15px; line-height: 1.6;">
                                Congratulations! Your administrator account has been successfully created for <strong>${companyName}</strong> HRMS System. You now have full access to manage your organization's human resources.
                            </p>
                            
                            <!-- Credentials Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 10px; border-left: 5px solid #667eea; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h2 style="margin: 0 0 20px 0; color: #667eea; font-size: 20px; font-weight: 600;">
                                            🔐 Your Login Credentials
                                        </h2>
                                        
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 10px 0;">
                                                    <p style="margin: 0; color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Login ID
                                                    </p>
                                                    <p style="margin: 5px 0 0 0; color: #333333; font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace;">
                                                        ${loginId}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0;">
                                                    <p style="margin: 0; color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Password
                                                    </p>
                                                    <p style="margin: 5px 0 0 0; color: #333333; font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace;">
                                                        ${password}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0;">
                                                    <p style="margin: 0; color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Email
                                                    </p>
                                                    <p style="margin: 5px 0 0 0; color: #333333; font-size: 16px; font-weight: 600;">
                                                        ${email}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0;">
                                                    <p style="margin: 0; color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Role
                                                    </p>
                                                    <p style="margin: 5px 0 0 0; color: #667eea; font-size: 16px; font-weight: 700;">
                                                        👑 Administrator
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Warning Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                            <strong>⚠️ Important Security Notice:</strong><br>
                                            Please keep these credentials secure and do not share them with anyone. You can change your password after logging in from the settings menu.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Action Steps -->
                            <div style="margin: 30px 0;">
                                <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px; font-weight: 600;">
                                    📋 Next Steps:
                                </h3>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <p style="margin: 0; color: #555555; font-size: 15px;">
                                                <strong style="color: #667eea;">1.</strong> Login to your HRMS system
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <p style="margin: 0; color: #555555; font-size: 15px;">
                                                <strong style="color: #667eea;">2.</strong> Complete your company profile
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <p style="margin: 0; color: #555555; font-size: 15px;">
                                                <strong style="color: #667eea;">3.</strong> Add your employees to the system
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <p style="margin: 0; color: #555555; font-size: 15px;">
                                                <strong style="color: #667eea;">4.</strong> Configure system settings
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="margin: 30px 0 0 0; color: #555555; font-size: 15px; line-height: 1.6;">
                                Best regards,<br>
                                <strong style="color: #667eea;">${companyName} HRMS Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px;">
                                This is an automated email from HRMS System
                            </p>
                            <p style="margin: 0; color: #6c757d; font-size: 13px;">
                                Please do not reply to this message
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    await sendEmail({
        to: email,
        subject,
        text,
        html
    });
};

/**
 * @desc    Send employee creation credentials email
 * @param   {string} email - Employee email address
 * @param   {string} name - Employee name
 * @param   {string} loginId - Generated login ID
 * @param   {string} password - Temporary password (plain text)
 * @param   {string} companyName - Company name
 * @returns {Promise}
 */
export const sendEmployeeCredentialsEmail = async (email, name, loginId, password, companyName) => {
    const subject = `Welcome to ${companyName} - Your Employee Login Credentials`;
    
    const text = `
Dear ${name},

Welcome to ${companyName}!

Your employee account has been created. Below are your login credentials:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOGIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Login ID: ${loginId}
Temporary Password: ${password}
Email: ${email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT: You MUST change your password on first login for security purposes.

Next Steps:
1. Login to the HRMS system using your credentials
2. Change your password immediately
3. Complete your profile information

If you have any questions, please contact your HR department.

Best regards,
${companyName} HR Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated email. Please do not reply.
    `.trim();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                👋 Welcome to ${companyName}
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e0f7f4; font-size: 16px;">
                                Your Employee Account is Ready
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                Dear <strong>${name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #555555; font-size: 15px; line-height: 1.6;">
                                Your employee account has been successfully created in the <strong>${companyName}</strong> HRMS System. You can now access the system to manage your work information, attendance, leaves, and more.
                            </p>
                            
                            <!-- Credentials Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #11998e15 0%, #38ef7d15 100%); border-radius: 10px; border-left: 5px solid #11998e; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h2 style="margin: 0 0 20px 0; color: #11998e; font-size: 20px; font-weight: 600;">
                                            🔐 Your Login Credentials
                                        </h2>
                                        
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 10px 0;">
                                                    <p style="margin: 0; color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Login ID
                                                    </p>
                                                    <p style="margin: 5px 0 0 0; color: #333333; font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace;">
                                                        ${loginId}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0;">
                                                    <p style="margin: 0; color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Temporary Password
                                                    </p>
                                                    <p style="margin: 5px 0 0 0; color: #333333; font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace;">
                                                        ${password}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0;">
                                                    <p style="margin: 0; color: #666666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Email
                                                    </p>
                                                    <p style="margin: 5px 0 0 0; color: #333333; font-size: 16px; font-weight: 600;">
                                                        ${email}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Warning Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px 0; color: #856404; font-size: 15px; font-weight: 700;">
                                            ⚠️ Password Change Required
                                        </p>
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                            For security reasons, you <strong>MUST change your password</strong> when you login for the first time. This temporary password is only valid for your initial login.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Next Steps -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 12px 0; color: #2e7d32; font-size: 15px; font-weight: 700;">
                                            📌 Next Steps:
                                        </p>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 5px 0;">
                                                    <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                                                        <strong>1.</strong> Login to the HRMS system
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 5px 0;">
                                                    <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                                                        <strong>2.</strong> Change your password immediately
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 5px 0;">
                                                    <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                                                        <strong>3.</strong> Complete your profile information
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 5px 0;">
                                                    <p style="margin: 0; color: #2e7d32; font-size: 14px;">
                                                        <strong>4.</strong> Explore the system features
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 25px 0 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                If you have any questions or need assistance, please contact your HR department.
                            </p>
                            
                            <p style="margin: 30px 0 0 0; color: #555555; font-size: 15px; line-height: 1.6;">
                                Best regards,<br>
                                <strong style="color: #11998e;">${companyName} HR Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px;">
                                This is an automated email from ${companyName} HRMS
                            </p>
                            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 13px;">
                                Please do not reply to this message
                            </p>
                            <p style="margin: 0; color: #6c757d; font-size: 12px;">
                                Keep your credentials secure and do not share them with anyone
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    await sendEmail({
        to: email,
        subject,
        text,
        html
    });
};

/**
 * @desc    Send forgot password reset OTP email
 * @param   {string} email - User email address
 * @param   {string} name - User name
 * @param   {string} otp - 6-digit OTP code
 * @returns {Promise}
 */
export const sendForgotPasswordEmail = async (email, name, otp) => {
    const subject = '🔐 Password Reset Request - Your OTP Code';
    
    const text = `
Dear ${name || 'User'},

You have requested to reset your password for your HRMS account.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASSWORD RESET OTP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your One-Time Password (OTP): ${otp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This OTP is valid for 10 minutes only.

If you did not request a password reset, please ignore this email or contact support if you have concerns.

Best regards,
HRMS Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated email. Please do not reply.
    `.trim();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🔐 Password Reset Request</h1>
                            <p style="margin: 10px 0 0 0; color: #ffe0e6; font-size: 16px;">Secure Your Account</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">Dear <strong>${name || 'User'}</strong>,</p>
                            <p style="margin: 0 0 30px 0; color: #555555; font-size: 15px; line-height: 1.6;">We received a request to reset the password for your HRMS account. Use the OTP code below to proceed with resetting your password.</p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f093fb15 0%, #f5576c15 100%); border-radius: 10px; border-left: 5px solid #f5576c; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 30px; text-align: center;">
                                        <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your One-Time Password</p>
                                        <p style="margin: 0; color: #f5576c; font-size: 48px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                                        <p style="margin: 15px 0 0 0; color: #999999; font-size: 13px;">Valid for 10 minutes</p>
                                    </td>
                                </tr>
                            </table>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;"><strong>⚠️ Security Notice:</strong><br>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 30px 0 0 0; color: #555555; font-size: 15px; line-height: 1.6;">Best regards,<br><strong style="color: #f5576c;">HRMS Security Team</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px;">This is an automated security email from HRMS System</p>
                            <p style="margin: 0; color: #6c757d; font-size: 13px;">Please do not reply to this message</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    await sendEmail({
        to: email,
        subject,
        text,
        html
    });
};

/**
 * @desc    Send password reset link email
 * @param   {string} email - User email address
 * @param   {string} name - User name
 * @param   {string} resetUrl - Password reset URL
 * @returns {Promise}
 */
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
    const subject = '🔐 Password Reset Request - Reset Your Password';
    
    const text = `
Dear ${name || 'User'},

You have requested to reset your password for your HRMS account.

Click the link below to reset your password:
${resetUrl}

This link is valid for 30 minutes only.

If you did not request this password reset, please ignore this email or contact support if you have concerns.

Best regards,
HRMS Security Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated email. Please do not reply.
    `.trim();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🔐 Password Reset Request</h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Secure Your Account</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">Dear <strong>${name || 'User'}</strong>,</p>
                            <p style="margin: 0 0 30px 0; color: #555555; font-size: 15px; line-height: 1.6;">We received a request to reset the password for your HRMS account. Click the button below to reset your password.</p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">Reset Password</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 25px 0; color: #666666; font-size: 14px; text-align: center;">Or copy and paste this link in your browser:</p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                <tr>
                                    <td style="word-break: break-all;">
                                        <a href="${resetUrl}" style="color: #667eea; font-size: 13px; text-decoration: none;">${resetUrl}</a>
                                    </td>
                                </tr>
                            </table>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px 0; color: #856404; font-size: 15px; font-weight: 700;">⚠️ Important:</p>
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">This link will expire in <strong>30 minutes</strong>. If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 30px 0 0 0; color: #555555; font-size: 15px; line-height: 1.6;">Best regards,<br><strong style="color: #667eea;">HRMS Security Team</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px;">This is an automated security email from HRMS System</p>
                            <p style="margin: 0; color: #6c757d; font-size: 13px;">Please do not reply to this message</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    await sendEmail({
        to: email,
        subject,
        text,
        html
    });
};
