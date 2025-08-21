// app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function GET() {
  try {
    console.log('Testing email configuration...');
    
    // Check environment variables
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST ? '✅ Set' : '❌ Missing',
      SMTP_PORT: process.env.SMTP_PORT || '587',
      SMTP_USER: process.env.SMTP_USER ? '✅ Set' : '❌ Missing',
      SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '✅ Set' : '❌ Missing',
      SMTP_FROM: process.env.SMTP_FROM ? '✅ Set' : '❌ Missing',
    };
    
    console.log('Environment variables:', envCheck);
    
    // Test SMTP connection
    const connectionTest = await emailService.verifyConnection();
    
    return NextResponse.json({
      success: true,
      message: 'Email configuration test completed',
      environment: envCheck,
      connectionTest,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Email test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}