import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://whispering-tomes-website.lovable.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    console.log(`Sending ${type} email to: ${email}`);

    let emailData;

    if (type === 'welcome') {
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
        message: 'Email sent successfully',
        id: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
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
