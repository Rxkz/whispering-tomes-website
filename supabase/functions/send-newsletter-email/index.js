
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type, x-requested-with, accept, origin, referer, user-agent',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req) => {
  console.log('Send newsletter email function called');
  console.log('Method:', req.method);
  console.log('Origin:', req.headers.get('origin'));
  console.log('URL:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  try {
    const { type, email, data } = await req.json();
    console.log(`Processing ${type} for email: ${email}`);

    let emailData;

    if (type === 'welcome') {
      // Check if email already exists in newsletter_subscribers
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

      emailData = {
        from: "Newsletter <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to our Newsletter!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to our Newsletter!</h1>
            <p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
            <p>You'll receive updates about our latest content, news, and exclusive offers.</p>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>Best regards,<br>The Team</p>
          </div>
        `,
      };
    } else if (type === 'book_announcement') {
      emailData = {
        from: "Newsletter <onboarding@resend.dev>",
        to: [email],
        subject: `New Book Release: ${data.bookTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">New Book Release!</h1>
            <h2 style="color: #555;">${data.bookTitle}</h2>
            <p>${data.description}</p>
            <p><strong>Price: ${data.price}</strong></p>
            <p>Don't miss out on this exciting new release!</p>
            <p>Best regards,<br>The Team</p>
          </div>
        `,
      };
    } else {
      throw new Error(`Unknown email type: ${type}`);
    }

    console.log('Sending email with Resend...');
    const emailResponse = await resend.emails.send(emailData);
    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed! Check your email for a welcome message.',
        id: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in email function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request. Please try again.',
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
