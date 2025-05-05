// Follow this setup guide to integrate the Deno standard library:
// https://docs.deno.land/manual/standard_library
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

// This function will run on a schedule (daily at midnight) using Supabase's scheduled functions
// See: https://supabase.com/docs/guides/functions/schedule-functions

interface SubscriptionData {
  plan: 'BASIC' | 'PREMIUM' | 'PROFESSIONAL';
}

interface PricingTable {
  BASIC: number;
  PREMIUM: number;
  PROFESSIONAL: number;
}

serve(async () => {
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Use service role key for admin access to all tables
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Gather stats
    const [
      totalUsers,
      totalCustomers,
      totalWorkers,
      totalAdmins,
      totalJobs,
      pendingJobs,
      completedJobs,
      canceledJobs,
      totalApplications,
      acceptedApplications,
      totalRevenue,
      // Get today's date at midnight for filtering today's stats
      todayStart
    ] = await Promise.all([
      // Count users
      supabase.from('User').select('*', { count: 'exact', head: true }),
      supabase.from('User').select('*', { count: 'exact', head: true }).eq('role', 'CUSTOMER'),
      supabase.from('User').select('*', { count: 'exact', head: true }).eq('role', 'WORKER'),
      supabase.from('User').select('*', { count: 'exact', head: true }).eq('role', 'ADMIN'),
      
      // Count jobs
      supabase.from('JobListing').select('*', { count: 'exact', head: true }),
      supabase.from('JobListing').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
      supabase.from('JobListing').select('*', { count: 'exact', head: true }).eq('status', 'COMPLETED'),
      supabase.from('JobListing').select('*', { count: 'exact', head: true }).eq('status', 'CANCELLED'),
      
      // Count applications
      supabase.from('Application').select('*', { count: 'exact', head: true }),
      supabase.from('Application').select('*', { count: 'exact', head: true }).eq('status', 'ACCEPTED'),
      
      // Calculate revenue (placeholder logic - actual implementation would depend on your data model)
      supabase.from('Subscription')
        .select('plan')
        .eq('status', 'ACTIVE')
        .then(({ data }: { data: SubscriptionData[] | null }) => {
          // Placeholder pricing
          const pricing: PricingTable = {
            'BASIC': 9.99,
            'PREMIUM': 19.99,
            'PROFESSIONAL': 29.99
          };
          
          // Calculate total based on active subscriptions
          if (!data) return 0;
          
          return data.reduce((total: number, sub: SubscriptionData) => {
            return total + (pricing[sub.plan] || 0);
          }, 0);
        }),
      
      // Get today's date
      Promise.resolve(new Date().setHours(0, 0, 0, 0))
    ]);
    
    // Get new users today
    const { count: newUsersToday } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', new Date(todayStart).toISOString());
      
    // Get new jobs today
    const { count: newJobsToday } = await supabase
      .from('JobListing')
      .select('*', { count: 'exact', head: true })
      .gte('createdAt', new Date(todayStart).toISOString());
    
    // Create or update AdminStats record
    const statsData = {
      totalUsers: totalUsers.count,
      activeCustomers: totalCustomers.count,
      activeWorkers: totalWorkers.count,
      adminUsers: totalAdmins.count,
      totalJobs: totalJobs.count,
      pendingJobs: pendingJobs.count,
      completedJobs: completedJobs.count,
      canceledJobs: canceledJobs.count,
      totalApplications: totalApplications.count,
      acceptedApplications: acceptedApplications.count,
      newUsersToday,
      newJobsToday,
      revenue: totalRevenue,
      lastUpdated: new Date().toISOString()
    };
    
    // Update the stats record
    const { error } = await supabase
      .from('AdminStats')
      .upsert({ id: 'current', ...statsData });
      
    if (error) {
      throw new Error(`Error updating admin stats: ${error.message}`);
    }
    
    console.log('Admin stats updated successfully:', statsData);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Admin stats updated successfully' }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error: unknown) {
    console.error('Error updating admin stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}); 