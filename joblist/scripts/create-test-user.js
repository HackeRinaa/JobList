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

async function createTestUser() {
  try {
    const email = 'marina.papadimitriou@outlook.com';
    const password = 'testpassword123';
    const name = 'Marina Papadimitriou';
    
    console.log(`🔧 Creating test user: ${email}`);
    
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'WORKER',
        name: name
      }
    });
    
    if (authError) {
      console.error('❌ Error creating auth user:', authError);
      return;
    }
    
    console.log('✅ Created Supabase auth user:', authData.user?.id);
    
    // 2. Create user in database
    const dbUser = await prisma.user.create({
      data: {
        email,
        name,
        role: 'WORKER',
        authId: authData.user?.id,
        tokens: 10
      }
    });
    
    console.log('✅ Created database user:', dbUser.id);
    
    // 3. Create profile
    const profile = await prisma.profile.create({
      data: {
        userId: dbUser.id,
        bio: 'Test worker profile',
        phone: '+306912345678',
        preferences: ['ELECTRICIAN', 'PLUMBER']
      }
    });
    
    console.log('✅ Created profile:', profile.id);
    
    console.log('\n🎉 Test user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('You can now log in with these credentials.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 