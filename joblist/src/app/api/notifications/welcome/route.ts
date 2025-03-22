import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: Request) {
  try {
    const { email, phone, name, type } = await req.json();

    // Send welcome email
    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to JobList!',
      html: `
        <h1>Welcome to JobList, ${name}!</h1>
        <p>Thank you for joining our platform as a ${type}.</p>
        <p>We're excited to help you ${type === 'CUSTOMER' ? 'find the perfect professional' : 'find great job opportunities'}.</p>
        <p>Get started by completing your profile and ${type === 'CUSTOMER' ? 'posting your first job' : 'browsing available jobs'}.</p>
      `,
    });

    // Send welcome SMS
    await twilioClient.messages.create({
      body: `Welcome to JobList, ${name}! We're excited to have you join us as a ${type}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return NextResponse.json({ message: 'Welcome notifications sent successfully' });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome notifications' },
      { status: 500 }
    );
  }
} 