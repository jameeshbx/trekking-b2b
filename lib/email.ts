// lib/email.ts
import nodemailer from "nodemailer"

interface EmailData {
  customerName: string
  customerEmail: string
  itineraryId: string
  enquiryId?: string | null
  notes?: string | null
  destinations: string
  startDate?: Date | null
  endDate?: Date | null
  budget?: number | null
  currency?: string
  pdfUrl: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

interface DMCEmailData {
  enquiryId: string
  dateGenerated: string
  pdfPath: string
}

interface NodemailerError extends Error {
  code?: string
  command?: string
  response?: string
  responseCode?: number
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Create transporter with environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      // Additional options for better compatibility
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  async verifyConnection(): Promise<boolean> {
    try {
      console.log("Testing SMTP connection...")
      console.log("SMTP Config:", {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? "Set" : "Missing",
        pass: process.env.SMTP_PASSWORD ? "Set" : "Missing",
      })

      const result = await this.transporter.verify()
      console.log("SMTP connection verified:", result)
      return result
    } catch (error) {
      console.error("SMTP connection failed:", error)

      if (error instanceof Error) {
        const nodemailerError = error as NodemailerError
        console.error("Error details:", {
          name: nodemailerError.name,
          message: nodemailerError.message,
          code: nodemailerError.code,
          command: nodemailerError.command,
        })
      }

      return false
    }
  }

  async sendItineraryToCustomer(emailData: EmailData): Promise<EmailResult> {
    try {
      console.log("Preparing email for:", emailData.customerEmail)

      // Create email HTML template
      const emailHtml = this.createEmailTemplate(emailData)

      // Prepare email options
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: emailData.customerEmail,
        subject: `Your Travel Itinerary - ${emailData.destinations}`,
        html: emailHtml,
        attachments: emailData.pdfUrl
          ? [
              {
                filename: `itinerary-${emailData.itineraryId}.pdf`,
                path: emailData.pdfUrl,
                contentType: "application/pdf",
              },
            ]
          : [],
      }

      console.log("Sending email with options:", {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        hasAttachments: mailOptions.attachments.length > 0,
      })

      // Send email
      const info = await this.transporter.sendMail(mailOptions)
      console.log("Email sent successfully:", info.messageId)

      return {
        success: true,
        messageId: info.messageId,
      }
    } catch (error) {
      console.error("Failed to send email:", error)

      let errorMessage = "Unknown email error"

      if (error instanceof Error) {
        errorMessage = error.message

        // Handle specific error types
        if (error.message.includes("EAUTH")) {
          errorMessage = "Authentication failed - check email credentials"
        } else if (error.message.includes("ENOTFOUND")) {
          errorMessage = "SMTP server not found - check host configuration"
        } else if (error.message.includes("ECONNREFUSED")) {
          errorMessage = "Connection refused - check port and host"
        } else if (error.message.includes("ETIMEDOUT")) {
          errorMessage = "Connection timeout - check network/firewall"
        }
      }

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async sendItineraryToDMC(email: string, name: string, dmcData: DMCEmailData): Promise<boolean> {
    try {
      console.log("Preparing DMC email for:", email)

      // Create email HTML template for DMC
      const emailHtml = this.createDMCEmailTemplate(name, dmcData)

      // Prepare email options
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: `New Itinerary Request - ${dmcData.enquiryId}`,
        html: emailHtml,
        attachments: dmcData.pdfPath
          ? [
              {
                filename: `itinerary-${dmcData.enquiryId}.pdf`,
                path: dmcData.pdfPath,
                contentType: "application/pdf",
              },
            ]
          : [],
      }

      console.log("Sending DMC email with options:", {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        hasAttachments: mailOptions.attachments.length > 0,
      })

      // Send email
      const info = await this.transporter.sendMail(mailOptions)
      console.log("DMC email sent successfully:", info.messageId)

      return true
    } catch (error) {
      console.error("Failed to send DMC email:", error)
      return false
    }
  }

  private createEmailTemplate(emailData: EmailData): string {
    const formatDate = (date: Date | null | undefined): string => {
      if (!date) return "Not specified"
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Travel Itinerary</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #28a745;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #28a745;
          margin: 0;
          font-size: 28px;
        }
        .info-section {
          margin-bottom: 25px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .label {
          font-weight: bold;
          color: #555;
        }
        .value {
          color: #333;
        }
        .notes {
          background: #f8f9fa;
          padding: 15px;
          border-left: 4px solid #28a745;
          margin: 20px 0;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 14px;
        }
        .attachment-notice {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌟 Your Travel Itinerary</h1>
          <p>Prepared specially for ${emailData.customerName}</p>
        </div>

        <div class="info-section">
          <div class="info-row">
            <span class="label">Destination(s):</span>
            <span class="value">${emailData.destinations}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Travel Dates:</span>
            <span class="value">
              ${formatDate(emailData.startDate)} - ${formatDate(emailData.endDate)}
            </span>
          </div>

          ${
            emailData.budget
              ? `
          <div class="info-row">
            <span class="label">Budget:</span>
            <span class="value">${emailData.currency} ${emailData.budget?.toLocaleString()}</span>
          </div>
          `
              : ""
          }

          <div class="info-row">
            <span class="label">Itinerary ID:</span>
            <span class="value">${emailData.itineraryId}</span>
          </div>
        </div>

        ${
          emailData.pdfUrl
            ? `
        <div class="attachment-notice">
          📎 <strong>Your detailed itinerary is attached as a PDF file</strong><br>
          Please download and review the complete travel plan.
        </div>
        `
            : ""
        }

        ${
          emailData.notes
            ? `
        <div class="notes">
          <strong>Special Notes:</strong><br>
          ${emailData.notes}
        </div>
        `
            : ""
        }

        <div class="footer">
          <p>Thank you for choosing our travel services!</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">
            This email was sent automatically. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  private createDMCEmailTemplate(dmcName: string, dmcData: DMCEmailData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Itinerary Request</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #007bff;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #007bff;
          margin: 0;
        }
        .info-section {
          margin-bottom: 25px;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 New Itinerary Request</h1>
        </div>

        <div class="info-section">
          <p>Dear ${dmcName},</p>
          <p>You have received a new itinerary request with the following details:</p>
          
          <p><strong>Enquiry ID:</strong> ${dmcData.enquiryId}</p>
          <p><strong>Date Generated:</strong> ${dmcData.dateGenerated}</p>
          
          <p>Please find the detailed itinerary attached as a PDF file. Review the document and provide your quotation at your earliest convenience.</p>
        </div>

        <div class="footer">
          <p>Thank you for your partnership!</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
    `
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export sendEmail function for forgot-password functionality
export async function sendEmail(options: {
  to: string
  subject: string
  html: string
}): Promise<EmailResult> {
  try {
    const transporter = emailService["transporter"] // Access private transporter

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    }

    const info = await transporter.sendMail(mailOptions)

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error) {
    console.error("Failed to send email:", error)

    let errorMessage = "Unknown email error"
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}
