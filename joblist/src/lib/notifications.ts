import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { prisma } from './prisma';

// Initialize Twilio client with validation
const isTwilioConfigured = () => {
  return process.env.TWILIO_ACCOUNT_SID && 
         process.env.TWILIO_AUTH_TOKEN && 
         process.env.TWILIO_PHONE_NUMBER &&
         process.env.TWILIO_ACCOUNT_SID.startsWith('AC');
};

// Only create the client if properly configured
const twilioClient = isTwilioConfigured() 
  ? twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)
  : null;

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: process.env.EMAIL_SERVER_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

/**
 * Send an SMS notification
 * @param phoneNumber The phone number to send the SMS to
 * @param message The message to send
 */
export async function sendSMS(phoneNumber: string, message: string) {
  if (!twilioClient || !isTwilioConfigured()) {
    console.warn('Twilio client not configured properly. SMS not sent.');
    return false;
  }

  try {
    if (!process.env.TWILIO_PHONE_NUMBER) {
      console.warn('Twilio phone number not configured. SMS not sent.');
      return false;
    }
    
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

/**
 * Send an email notification
 * @param to The email address to send to
 * @param subject The email subject
 * @param html The HTML content of the email
 */
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Notify a user about a new message
 * @param userId The ID of the user to notify
 * @param applicationId The ID of the application related to the message
 * @param senderName The name of the message sender
 */
export async function notifyNewMessage(userId: string, applicationId: string, senderName: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) return;

    // Prepare notification content
    const subject = 'New Message on JobList';
    const messagePreview = `${senderName} sent you a new message`;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/${user.role.toLowerCase()}/chat?applicationId=${applicationId}`;
    
    // Email HTML content
    const html = `
      <h2>New Message</h2>
      <p>${messagePreview}</p>
      <p>Click <a href="${url}">here</a> to view and reply to the message.</p>
    `;

    // Send email notification
    await sendEmail(user.email, subject, html);

    // Send SMS if phone number is available
    if (user.profile?.phone) {
      const smsMessage = `${messagePreview}. Log in to your JobList account to respond.`;
      await sendSMS(user.profile.phone, smsMessage);
    }
  } catch (error) {
    console.error('Error sending message notification:', error);
  }
}

/**
 * Notify a worker about a new job listing that matches their expertise
 * @param workerId The ID of the worker to notify
 * @param jobId The ID of the new job listing
 * @param jobTitle The title of the job listing
 */
export async function notifyMatchingJob(workerId: string, jobId: string, jobTitle: string) {
  try {
    const worker = await prisma.user.findUnique({
      where: { id: workerId },
      include: { profile: true },
    });

    if (!worker) return;

    // Prepare notification content
    const subject = 'New Job Matching Your Expertise';
    const jobPreview = `"${jobTitle}" matches your skills`;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/worker/listings?jobId=${jobId}`;
    
    // Email HTML content
    const html = `
      <h2>New Job Opportunity</h2>
      <p>We found a new job that matches your expertise: ${jobTitle}</p>
      <p>Click <a href="${url}">here</a> to view the job details and apply.</p>
    `;

    // Send email notification
    await sendEmail(worker.email, subject, html);

    // Send SMS if phone number is available
    if (worker.profile?.phone) {
      const smsMessage = `JobList: ${jobPreview}. Check your account to apply.`;
      await sendSMS(worker.profile.phone, smsMessage);
    }
  } catch (error) {
    console.error('Error sending matching job notification:', error);
  }
}

/**
 * Notify a customer about a new application to their job listing
 * @param customerId The ID of the customer to notify
 * @param jobId The ID of the job listing
 * @param jobTitle The title of the job listing
 * @param workerName The name of the worker who applied
 */
export async function notifyNewApplication(customerId: string, jobId: string, jobTitle: string, workerName: string) {
  try {
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      include: { profile: true },
    });

    if (!customer) return;

    // Prepare notification content
    const subject = 'New Application for Your Job Listing';
    const applicationPreview = `${workerName} applied to your job: "${jobTitle}"`;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/customer/listings?jobId=${jobId}`;
    
    // Email HTML content
    const html = `
      <h2>New Job Application</h2>
      <p>${applicationPreview}</p>
      <p>Click <a href="${url}">here</a> to view the application details.</p>
    `;

    // Send email notification
    await sendEmail(customer.email, subject, html);

    // Send SMS if phone number is available
    if (customer.profile?.phone) {
      const smsMessage = `JobList: ${applicationPreview}. Check your account to respond.`;
      await sendSMS(customer.profile.phone, smsMessage);
    }
  } catch (error) {
    console.error('Error sending new application notification:', error);
  }
}

/**
 * Notify a worker that they've been assigned to a job
 * @param workerId The ID of the worker to notify
 * @param jobId The ID of the job listing
 * @param jobTitle The title of the job listing
 */
export async function notifyAssignedJob(workerId: string, jobId: string, jobTitle: string) {
  try {
    const worker = await prisma.user.findUnique({
      where: { id: workerId },
      include: { profile: true },
    });

    if (!worker) return;

    // Prepare notification content
    const subject = 'You Have Been Assigned to a Job';
    const jobAssignedPreview = `Congratulations! You have been assigned to the job: "${jobTitle}"`;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/worker/listings?jobId=${jobId}`;
    
    // Email HTML content
    const html = `
      <h2>Job Assignment</h2>
      <p>${jobAssignedPreview}</p>
      <p>Click <a href="${url}">here</a> to view the job details and get started.</p>
    `;

    // Send email notification
    await sendEmail(worker.email, subject, html);

    // Send SMS if phone number is available
    if (worker.profile?.phone) {
      const smsMessage = `JobList: ${jobAssignedPreview}. Check your account for details.`;
      await sendSMS(worker.profile.phone, smsMessage);
    }
  } catch (error) {
    console.error('Error sending job assignment notification:', error);
  }
} 