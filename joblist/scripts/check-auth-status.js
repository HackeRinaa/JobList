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

async function checkAuthStatus() {
  try {
    const email = 'marina.papadimitriou@outlook.com';
    
    console.log('=== Checking Authentication Status ===');
    
    // Check if user exists in Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }
    
    const authUser = authUsers.users.find(user => user.email === email);
    
    if (authUser) {
      console.log('✅ User exists in Supabase Auth:');
      console.log(`  - ID: ${authUser.id}`);
      console.log(`  - Email: ${authUser.email}`);
      console.log(`  - Role: ${authUser.user_metadata?.role || 'N/A'}`);
      console.log(`  - Confirmed: ${authUser.email_confirmed_at ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ User NOT found in Supabase Auth');
    }
    
    // Check if user exists in database
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
    
    // Check for mismatches
    if (authUser && dbUser) {
      if (dbUser.authId !== authUser.id) {
        console.log('\n⚠️  MISMATCH: Database authId does not match Supabase Auth ID');
        console.log(`  - Database authId: ${dbUser.authId}`);
        console.log(`  - Supabase Auth ID: ${authUser.id}`);
      } else {
        console.log('\n✅ User properly linked between database and Supabase Auth');
      }
    }
    
    // Provide recommendations
    console.log('\n=== Recommendations ===');
    
    if (!authUser && !dbUser) {
      console.log('• User does not exist anywhere - you can register normally');
    } else if (authUser && !dbUser) {
      console.log('• User exists in Supabase Auth but not in database');
      console.log('• Delete the Supabase Auth user and re-register');
    } else if (!authUser && dbUser) {
      console.log('• User exists in database but not in Supabase Auth');
      console.log('• Delete the database user and re-register');
    } else if (authUser && dbUser && dbUser.authId !== authUser.id) {
      console.log('• User exists in both but IDs do not match');
      console.log('• Delete both and re-register');
    }
    
  } catch (error) {
    console.error('Error checking auth status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAuthStatus(); 