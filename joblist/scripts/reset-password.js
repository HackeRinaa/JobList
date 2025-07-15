import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetPassword() {
  try {
    const email = 'marina.papadimitriou@outlook.com';
    const newPassword = 'TestPassword123!'; // You can change this
    
    console.log(`Resetting password for: ${email}`);
    console.log(`New password: ${newPassword}`);
    
    // Update the user's password
    const { error } = await supabase.auth.admin.updateUserById(
      '9f480402-ed8f-4830-bfc5-1809149d6c06', // User ID from your JSON
      { password: newPassword }
    );

    if (error) {
      console.error('Error resetting password:', error);
      return;
    }

    console.log('Password reset successfully!');
    console.log('You can now log in with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

resetPassword(); 