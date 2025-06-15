
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
        auth: { persistSession: false }
      }
    );
    
    // Get the session to verify the request
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { pathname } = new URL(req.url);
    
    // Handle daily-check-in endpoint
    if (pathname.endsWith('/daily-check-in')) {
      const { user_id } = await req.json();
      
      // Only allow claiming the reward if user matches the authenticated user
      if (user_id !== session.user.id) {
        return new Response(
          JSON.stringify({ error: 'User ID mismatch' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Check if already claimed today
      const { data: alreadyClaimed } = await supabaseClient.rpc(
        'has_claimed_daily_reward',
        { user_uuid: user_id }
      );
      
      if (alreadyClaimed) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            alreadyClaimed: true, 
            message: 'Already claimed today\'s reward' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Calculate streak
      const { data: streak } = await supabaseClient.rpc(
        'calculate_streak',
        { user_uuid: user_id }
      );
      
      const currentStreak = streak || 1;
      
      // Calculate reward based on streak
      const { data: baseReward } = await supabaseClient.rpc(
        'calculate_reward',
        { streak: currentStreak }
      );
      
      // Multiply reward by 10
      const rewardAmount = (baseReward || 1.0) * 10;
      
      // Record the daily reward with original reward (backend record)
      const { error: insertError } = await supabaseClient
        .from('daily_rewards')
        .insert({
          user_id,
          check_in_date: new Date().toISOString().split('T')[0],
          streak_count: currentStreak,
          reward_amount: baseReward,
          collected: true
        });
        
      if (insertError) {
        console.error('Error recording reward:', insertError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Error recording reward' 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
        
      // Update FREN balance with the multiplied reward
      const { data: currentProfile } = await supabaseClient
        .from('profiles')
        .select('fren_balance')
        .eq('user_id', user_id)
        .single();
        
      const oldBalance = currentProfile?.fren_balance || 0;
      const newBalance = oldBalance + rewardAmount;
      
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ fren_balance: newBalance })
        .eq('user_id', user_id);
        
      if (updateError) {
        console.error('Error updating balance:', updateError);
        // Still consider it a success since the reward was recorded
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          streak: currentStreak,
          reward: rewardAmount / 10, // Return base reward for client-side multiplication
          newBalance
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
      
    // Default response for other paths
    return new Response(
      JSON.stringify({ status: "Service running" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
