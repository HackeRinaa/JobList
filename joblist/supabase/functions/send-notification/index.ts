// Follow this setup guide to integrate the Deno standard library:
// https://docs.deno.land/manual/standard_library
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { Twilio } from 'https://esm.sh/twilio@4.8.0';

interface RequestData {
  type: string;
  recipientId: string;
  data: {
    jobTitle?: string;
    [key: string]: any;
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get request data
    const { type, recipientId, data } = await req.json() as RequestData;

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get recipient user data
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('email, name, profile(phone)')
      .eq('id', recipientId)
      .single();

    if (userError || !user) {
      throw new Error(`Error fetching user: ${userError?.message || 'User not found'}`);
    }

    const userEmail = user.email;
    const userName = user.name || 'User';
    const userPhone = user.profile?.phone;

    // Initialize notification data
    let emailSubject = '';
    let emailBody = '';
    let smsBody = '';

    // Compose notification content based on type
    switch (type) {
      case 'new_application':
        emailSubject = 'New Application Received';
        emailBody = `Hi ${userName}, you have received a new application for your job "${data.jobTitle}". Log in to review it.`;
        smsBody = `JobList: New application received for "${data.jobTitle}". Log in to review it.`;
        break;

      case 'application_accepted':
        emailSubject = 'Your Application was Accepted!';
        emailBody = `Congratulations ${userName}! Your application for "${data.jobTitle}" has been accepted. Log in to communicate with the client.`;
        smsBody = `JobList: Your application for "${data.jobTitle}" has been accepted! Log in to communicate with the client.`;
        break;

      case 'new_message':
        emailSubject = 'New Message Received';
        emailBody = `Hi ${userName}, you have received a new message regarding "${data.jobTitle}". Log in to view it.`;
        smsBody = `JobList: New message received for "${data.jobTitle}". Log in to view it.`;
        break;

      case 'job_completed':
        emailSubject = 'Job Marked as Completed';
        emailBody = `Hi ${userName}, the job "${data.jobTitle}" has been marked as completed. Please log in to leave a review.`;
        smsBody = `JobList: Job "${data.jobTitle}" has been marked as completed. Please log in to leave a review.`;
        break;

      default:
        emailSubject = 'Notification from JobList';
        emailBody = `Hi ${userName}, you have a new notification from JobList. Log in to view details.`;
        smsBody = `JobList: You have a new notification. Log in to view details.`;
    }

    // Send email notification
    // This is a placeholder for actual email sending
    // In production, you'd use a service like SendGrid or AWS SES
    console.log(`[EMAIL] To: ${userEmail}, Subject: ${emailSubject}, Body: ${emailBody}`);

    // Send SMS notification if phone number is available
    if (userPhone) {
      const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
      const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
      const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

      if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
        // Initialize Twilio client
        try {
          const twilio = new Twilio(twilioAccountSid, twilioAuthToken);
          
          // Send SMS - this is commented out to prevent actual sending during development
          // await twilio.messages.create({
          //   body: smsBody,
          //   from: twilioPhoneNumber,
          //   to: userPhone
          // });
          
          console.log(`[SMS] To: ${userPhone}, Body: ${smsBody}`);
        } catch (err) {
          console.error('Twilio error:', err);
        }
      }
    }

    // Record the notification in the database (if needed)
    try {
      await supabase
        .from('Notification')
        .insert({
          userId: recipientId,
          type,
          content: emailBody,
          read: false
        });
    } catch (notificationError) {
      console.error('Error recording notification:', notificationError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error: unknown) {
    console.error('Error processing notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}); 