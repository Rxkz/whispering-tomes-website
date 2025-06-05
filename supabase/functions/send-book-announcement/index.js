
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookTitle, description, price } = await req.json();
    
    console.log(`Sending book announcement for: ${bookTitle}`);

    // Get all active subscribers
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (error) throw error;

    console.log(`Found ${subscribers.length} active subscribers`);

    // Send emails to all subscribers
    const emailPromises = subscribers.map(subscriber => 
      supabase.functions.invoke('send-newsletter-email', {
        body: {
          type: 'book_announcement',
          email: subscriber.email,
          data: {
            bookTitle,
            description,
            price
          }
        }
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    const successCount = results.filter(result => result.status === 'fulfilled').length;
    const failureCount = results.length - successCount;

    console.log(`Email sending completed: ${successCount} successful, ${failureCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Book announcement sent to ${successCount} subscribers`,
        successCount,
        failureCount
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error sending book announcement:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
