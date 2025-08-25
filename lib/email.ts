import nodemailer from "nodemailer";
import fs from "fs";


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

// Enhanced transporter creation with better Gmail support
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true";

  console.log('SMTP Configuration:', {
    host,
    user: user ? user.substring(0, 3) + '***' + user.slice(-10) : 'undefined',
    pass: pass ? '***' : 'undefined',
    port,
    secure
  });

  if (!host || !user || !pass) {
    throw new Error(`SMTP configuration missing. Check SMTP_HOST (${host ? 'OK' : 'MISSING'}), SMTP_USER (${user ? 'OK' : 'MISSING'}), SMTP_PASS (${pass ? 'OK' : 'MISSING'})`);
  }

  // Enhanced configuration for Gmail and other providers
  const config = {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: { rejectUnauthorized: false }, // if you use tls
    connectionTimeout: 10000, // if needed
    greetingTimeout: 5000,    // if needed
    socketTimeout: 10000,     // if needed
  };
  interface EmailConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
  service?: string;
}


  // Special handling for Gmail
  if (host.includes('gmail.com')) {
     (config as EmailConfig).service = 'gmail'
    // For Gmail, use OAuth2 or App Passwords
    console.log('Gmail detected - ensure you are using an App Password');
  } 

  return nodemailer.createTransport(config);
};

// Enhanced email sending function with retry mechanism
export async function sendEmail({ to, subject, html, attachments }: EmailOptions) {
  let lastError = null;
  let attempts = 0;
  const maxAttempts = 2;
  const transporter = createTransporter();

  while (attempts < maxAttempts) {
    try {
      await transporter.verify();
      // Check attachments
      const processedAttachments = [];
      if (attachments && attachments.length > 0) {
        for (const att of attachments) {
          if (att.path && !fs.existsSync(att.path)) {
            throw new Error(`Attachment file not found: ${att.path}`);
          }
          processedAttachments.push(att);
        }
      }
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
        attachments: processedAttachments.length > 0 ? processedAttachments : undefined,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      attempts++;
      if (attempts >= maxAttempts) {
        return { success: false, error: lastError, messageId: null };
      }
    }
  }
  return { success: false, error: lastError, messageId: null };
}

// Test email function for debugging
export async function testEmailConnection() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    transporter.close();
    console.log('Email connection test: SUCCESS');
    return { success: true, message: 'SMTP connection successful' };
  } catch (error) {
    console.error('Email connection test: FAILED', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}