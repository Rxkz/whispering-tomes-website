
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, data } = await req.json();
    
    console.log(`Sending ${type} email to ${email}`);

    let emailContent = '';
    let subject = '';

    if (type === 'welcome') {
      subject = 'Welcome to The Secret Library!';
      emailContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Cormorant Garamond', serif; background: #1a1a2e; color: #f4f1de; padding: 40px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #ffd700; font-size: 2.5em; margin: 0; letter-spacing: 2px;">THE SECRET LIBRARY</h1>
            <div style="width: 100px; height: 2px; background: #ffd700; margin: 20px auto;"></div>
          </div>
          
          <h2 style="color: #ffd700; font-size: 1.8em; margin-bottom: 20px;">Welcome, Fellow Book Lover!</h2>
          
          <p style="font-size: 1.1em; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining our exclusive circle of readers who appreciate the mystique and wonder of dark academia literature.
          </p>
          
          <p style="font-size: 1.1em; line-height: 1.6; margin-bottom: 20px;">
            As a subscriber, you'll be the first to know about:
          </p>
          
          <ul style="font-size: 1.1em; line-height: 1.8; margin-bottom: 30px; padding-left: 20px;">
            <li>📚 New book releases and exclusive previews</li>
            <li>✨ Behind-the-scenes insights into the writing process</li>
            <li>🎭 Special events and book readings</li>
            <li>🔮 Exclusive content and author updates</li>
          </ul>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://your-website.com/books" style="background: #ffd700; color: #1a1a2e; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 1.1em; letter-spacing: 1px;">EXPLORE OUR COLLECTION</a>
          </div>
          
          <p style="font-style: italic; text-align: center; color: #c9ada7; margin-top: 30px;">
            "In the silence of ancient libraries, whispers of forgotten wisdom await those who dare to listen."
          </p>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #444;">
            <p style="color: #888; font-size: 0.9em;">
              You're receiving this because you subscribed to our newsletter.<br>
              <a href="[UNSUBSCRIBE_LINK]" style="color: #ffd700;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `;
    } else if (type === 'book_announcement') {
      subject = `New Book Release: ${data.bookTitle}`;
      emailContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Cormorant Garamond', serif; background: #1a1a2e; color: #f4f1de; padding: 40px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #ffd700; font-size: 2.5em; margin: 0; letter-spacing: 2px;">THE SECRET LIBRARY</h1>
            <div style="width: 100px; height: 2px; background: #ffd700; margin: 20px auto;"></div>
          </div>
          
          <h2 style="color: #ffd700; font-size: 1.8em; margin-bottom: 20px;">📚 New Book Alert!</h2>
          
          <div style="background: #2a2a4e; padding: 30px; border-radius: 10px; margin: 30px 0;">
            <h3 style="color: #ffd700; font-size: 1.5em; margin-bottom: 15px;">${data.bookTitle}</h3>
            <p style="font-size: 1.1em; line-height: 1.6; margin-bottom: 20px;">
              ${data.description || 'A new enchanting tale awaits your discovery...'}
            </p>
            ${data.price ? `<p style="color: #ffd700; font-size: 1.2em; font-weight: bold;">Price: $${data.price}</p>` : ''}
          </div>
          
          <p style="font-size: 1.1em; line-height: 1.6; margin-bottom: 30px;">
            Dear reader, a new chapter in our collection has been unveiled. This latest work promises to transport you to realms where mystery and wonder intertwine.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://your-website.com/books" style="background: #ffd700; color: #1a1a2e; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 1.1em; letter-spacing: 1px;">DISCOVER THIS BOOK</a>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #444;">
            <p style="color: #888; font-size: 0.9em;">
              You're receiving this because you subscribed to our newsletter.<br>
              <a href="[UNSUBSCRIBE_LINK]" style="color: #ffd700;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `;
    }

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Secret Library <onboarding@resend.dev>',
        to: [email],
        subject: subject,
        html: emailContent,
      }),
    });

    const emailResult = await emailResponse.json();
    
    if (!emailResponse.ok) {
      throw new Error(`Resend API error: ${emailResult.message}`);
    }

    console.log('Email sent successfully:', emailResult);

    return new Response(JSON.stringify({ success: true, emailId: emailResult.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error sending email:', error);
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
