import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType?: string;
  }>;
}

// Fixed transporter creation
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS; // Changed from SMTP_PASSWORD to SMTP_PASS to match your env variable

  console.log('SMTP Configuration:', {
    host,
    user: user ? '***' + user.slice(-10) : 'undefined',
    pass: pass ? '***' : 'undefined',
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE
  });

  if (!host || !user || !pass) {
    throw new Error(`SMTP configuration missing. Check SMTP_HOST (${host ? 'OK' : 'MISSING'}), SMTP_USER (${user ? 'OK' : 'MISSING'}), SMTP_PASS (${pass ? 'OK' : 'MISSING'})`);
  }

  return nodemailer.createTransport({
    host: host,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: user,
      pass: pass,
    },
    // Add these options for better Gmail compatibility
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Enhanced email sending function with better error handling
export async function sendEmail({ to, subject, html, attachments }: EmailOptions) {
  try {
    console.log(`Attempting to send email to: ${to}`);
    
    const transporter = createTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    // Verify transporter configuration
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    const result = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments || [],
    });

    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error("Email sending failed:", error);
    
    // Better error messages for common Gmail issues
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        throw new Error('Gmail authentication failed. Please check if you are using an App Password instead of your regular password.');
      }
      if (error.message.includes('Connection timeout')) {
        throw new Error('SMTP connection timeout. Please check your network connection and SMTP settings.');
      }
      if (error.message.includes('ENOTFOUND')) {
        throw new Error('SMTP host not found. Please verify your SMTP_HOST setting.');
      }
    }
    
    throw new Error(`Email sending failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}