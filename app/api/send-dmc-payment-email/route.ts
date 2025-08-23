import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { dmcPaymentNotificationTemplate } from '@/lib/email-templates';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const to = formData.get('to') as string;
    const subject = formData.get('subject') as string;
    const paymentDetails = JSON.parse(formData.get('paymentDetails') as string);
    const file = formData.get('file') as File | null;

    if (!to || !subject || !paymentDetails) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: dmcPaymentNotificationTemplate(paymentDetails),
    };

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      mailOptions.attachments = [
        {
          filename: file.name,
          content: buffer,
          contentType: file.type,
        },
      ];
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
