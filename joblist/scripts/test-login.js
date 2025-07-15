import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = 'marina.papadimitriou@outlook.com';
    const password = 'testpassword123'; // Use the password you set
    
    console.log(`🔍 Testing login for: ${email}`);
    
    // 1. Check if user exists in Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error listing users:', authError);
      return;
    }
    
    const authUser = authUsers.users.find(user => user.email === email);
    
    if (authUser) {
      console.log('✅ User exists in Supabase Auth:');
      console.log(`  - ID: ${authUser.id}`);
      console.log(`  - Email: ${authUser.email}`);
      console.log(`  - Confirmed: ${authUser.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`  - Role: ${authUser.user_metadata?.role || 'N/A'}`);
    } else {
      console.log('❌ User NOT found in Supabase Auth');
    }
    
    // 2. Check if user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });
    
    if (dbUser) {
      console.log('\n✅ User exists in database:');
      console.log(`  - ID: ${dbUser.id}`);
      console.log(`  - Email: ${dbUser.email}`);
      console.log(`  - Role: ${dbUser.role}`);
      console.log(`  - Auth ID: ${dbUser.authId || 'Not linked'}`);
      console.log(`  - Has Profile: ${dbUser.profile ? 'Yes' : 'No'}`);
    } else {
      console.log('\n❌ User NOT found in database');
    }
    
    // 3. Test login with Supabase
    console.log('\n🔐 Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
    } else {
      console.log('✅ Login successful!');
      console.log(`  - User ID: ${loginData.user?.id}`);
      console.log(`  - Session: ${loginData.session ? 'Yes' : 'No'}`);
      console.log(`  - Access Token: ${loginData.session?.access_token ? 'Yes' : 'No'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin(); 