import nodemailer from 'nodemailer';

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email content
 * @param {string} options.html - HTML email content (optional)
 * @returns {Promise} - Returns promise with send result
 */
export const sendEmail = async (options) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: `"HRMS System" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html || options.text
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully:', info.messageId);
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

/**
 * Send admin signup credentials email
 * @param {string} email - Admin email address
 * @param {string} name - Admin name
 * @param {string} loginId - Generated login ID
 * @param {string} password - Admin password (plain text)
 * @param {string} companyName - Company name
 */
export const sendAdminSignupEmail = async (email, name, loginId, password, companyName) => {
    const subject = `Welcome to ${companyName} HRMS - Your Admin Credentials`;
    
    const text = `
Dear ${name},

Welcome to ${companyName} HRMS System!

Your admin account has been successfully created. Below are your login credentials:

Login ID: ${loginId}
Password: ${password}
Email: ${email}

Please login to the system using these credentials and keep them secure.

Best regards,
HRMS Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #4a90e2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 5px 5px;
        }
        .credentials {
            background-color: #f0f0f0;
            padding: 20px;
            border-left: 4px solid #4a90e2;
            margin: 20px 0;
        }
        .credentials p {
            margin: 10px 0;
        }
        .credential-label {
            font-weight: bold;
            color: #4a90e2;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #777;
            font-size: 12px;
        }
        .warning {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Welcome to ${companyName} HRMS</h2>
        </div>
        <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            
            <p>Congratulations! Your admin account has been successfully created for ${companyName} HRMS System.</p>
            
            <div class="credentials">
                <h3>Your Login Credentials</h3>
                <p><span class="credential-label">Login ID:</span> ${loginId}</p>
                <p><span class="credential-label">Password:</span> ${password}</p>
                <p><span class="credential-label">Email:</span> ${email}</p>
            </div>
            
            <p>You can now login to the system using these credentials and start managing your organization.</p>
            
            <p class="warning">⚠️ <strong>Important:</strong> Please keep these credentials secure and do not share them with anyone.</p>
            
            <p>Best regards,<br>
            <strong>HRMS Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
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
 * Send employee creation credentials email
 * @param {string} email - Employee email address
 * @param {string} name - Employee name
 * @param {string} loginId - Generated login ID
 * @param {string} password - Temporary password (plain text)
 * @param {string} companyName - Company name
 */
export const sendEmployeeCredentialsEmail = async (email, name, loginId, password, companyName) => {
    const subject = `Welcome to ${companyName} - Your Employee Login Credentials`;
    
    const text = `
Dear ${name},

Welcome to ${companyName}!

Your employee account has been created. Below are your login credentials:

Login ID: ${loginId}
Temporary Password: ${password}
Email: ${email}

IMPORTANT: You must change your password on first login for security purposes.

Please login to the system using these credentials.

Best regards,
${companyName} HR Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #27ae60;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 5px 5px;
        }
        .credentials {
            background-color: #f0f0f0;
            padding: 20px;
            border-left: 4px solid #27ae60;
            margin: 20px 0;
        }
        .credentials p {
            margin: 10px 0;
        }
        .credential-label {
            font-weight: bold;
            color: #27ae60;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #777;
            font-size: 12px;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .highlight {
            background-color: #e8f5e9;
            padding: 15px;
            border-left: 4px solid #4caf50;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Welcome to ${companyName}</h2>
        </div>
        <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            
            <p>Your employee account has been successfully created in the ${companyName} HRMS System.</p>
            
            <div class="credentials">
                <h3>Your Login Credentials</h3>
                <p><span class="credential-label">Login ID:</span> ${loginId}</p>
                <p><span class="credential-label">Temporary Password:</span> ${password}</p>
                <p><span class="credential-label">Email:</span> ${email}</p>
            </div>
            
            <div class="warning">
                <strong>⚠️ IMPORTANT - Password Change Required</strong>
                <p style="margin: 10px 0 0 0;">For security reasons, you will be required to change your password when you login for the first time.</p>
            </div>
            
            <div class="highlight">
                <strong>📌 Next Steps:</strong>
                <ol style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>Login to the HRMS system using your credentials</li>
                    <li>Change your password immediately</li>
                    <li>Complete your profile information</li>
                </ol>
            </div>
            
            <p>If you have any questions or need assistance, please contact your HR department.</p>
            
            <p>Best regards,<br>
            <strong>${companyName} HR Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>Keep your credentials secure and do not share them with anyone.</p>
        </div>
    </div>
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
