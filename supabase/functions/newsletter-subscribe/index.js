
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req) => {
  console.log('Newsletter subscribe function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Request body:', requestBody);
    
    const { email } = requestBody;
    
    if (!email || !email.includes('@')) {
      console.log('Invalid email provided:', email);
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log(`Processing newsletter subscription for: ${email}`);

    // Check if email already exists
    console.log('Checking for existing subscriber...');
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('email, is_active')
      .eq('email', email)
      .single();

    console.log('Existing subscriber check result:', { existingSubscriber, checkError });

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscriber:', checkError);
      throw checkError;
    }

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        console.log('Email already subscribed and active');
        return new Response(
          JSON.stringify({ error: 'This email is already subscribed to our newsletter' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      } else {
        console.log('Reactivating existing subscription');
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq('email', email);

        if (updateError) {
          console.error('Error reactivating subscription:', updateError);
          throw updateError;
        }
        console.log('Subscription reactivated successfully');
      }
    } else {
      console.log('Creating new subscription');
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (insertError) {
        console.error('Error inserting new subscriber:', insertError);
        throw insertError;
      }
      console.log('New subscription created successfully');
    }

    // Send welcome email
    console.log('Attempting to send welcome email...');
    try {
      const emailResponse = await supabase.functions.invoke('send-newsletter-email', {
        body: {
          type: 'welcome',
          email: email
        }
      });

      console.log('Email function response:', emailResponse);

      if (emailResponse.error) {
        console.error('Error sending welcome email:', emailResponse.error);
        // Don't fail the subscription if email fails
      } else {
        console.log('Welcome email sent successfully');
      }
    } catch (emailError) {
      console.error('Error calling email function:', emailError);
      // Don't fail the subscription if email fails
    }

    console.log(`Successfully subscribed: ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed! Check your email for a welcome message.' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in newsletter subscription:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to subscribe. Please try again.',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
