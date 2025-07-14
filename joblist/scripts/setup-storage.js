import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('Setting up Supabase Storage...');

    // Create the images bucket
    const { error: bucketError } = await supabase.storage
      .createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880, // 5MB
      });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('Images bucket already exists');
      } else {
        console.error('Error creating bucket:', bucketError);
        return;
      }
    } else {
      console.log('Images bucket created successfully');
    }

    // Set up bucket policies
    const { error: policyError } = await supabase.storage
      .from('images')
      .createPolicy('Public Read Access', {
        name: 'Public Read Access',
        definition: {
          role: 'anon',
          operation: 'SELECT',
        },
      });

    if (policyError) {
      if (policyError.message.includes('already exists')) {
        console.log('Public read policy already exists');
      } else {
        console.error('Error creating public read policy:', policyError);
      }
    } else {
      console.log('Public read policy created successfully');
    }

    // Create authenticated upload policy
    const { error: uploadPolicyError } = await supabase.storage
      .from('images')
      .createPolicy('Authenticated Upload Access', {
        name: 'Authenticated Upload Access',
        definition: {
          role: 'authenticated',
          operation: 'INSERT',
        },
      });

    if (uploadPolicyError) {
      if (uploadPolicyError.message.includes('already exists')) {
        console.log('Authenticated upload policy already exists');
      } else {
        console.error('Error creating upload policy:', uploadPolicyError);
      }
    } else {
      console.log('Authenticated upload policy created successfully');
    }

    console.log('Storage setup completed successfully!');
  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}

setupStorage(); 