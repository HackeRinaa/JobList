import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function simpleVerifyEmail() {
  try {
    const email = 'marina.papadimitriou@outlook.com';
    
    console.log(`🔍 Looking for user with email: ${email}`);
    
    // First, find the user
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError);
      return;
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log('❌ User not found in Supabase Auth');
      return;
    }
    
    console.log('✅ Found user:', {
      id: user.id,
      email: user.email,
      emailConfirmed: user.email_confirmed_at ? 'Yes' : 'No',
      createdAt: user.created_at
    });
    
    // Update the user to mark email as confirmed
    const { error } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        email_confirm: true
      }
    );
    
    if (error) {
      console.error('❌ Error verifying email:', error);
      return;
    }
    
    console.log('✅ Email verified successfully!');
    console.log('🎉 User can now log in without email confirmation.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

simpleVerifyEmail(); 