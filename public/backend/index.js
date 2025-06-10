require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(cors());

// Use bodyParser.json() only for non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// Supabase client (service role for server-side)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Test endpoint for SendGrid
app.get('/test-sendgrid', async (req, res) => {
  try {
    console.log('Testing SendGrid with API key:', process.env.SENDGRID_API_KEY ? 'Key loaded' : 'Key NOT loaded');
    
    await sgMail.send({
      to: 'rikhilprakash383@gmail.com',
      from: 'rikhilprakash383@gmail.com',
      subject: 'SendGrid Test',
      text: 'This is a test email from SendGrid!',
    });
    
    res.json({ success: true, message: 'Test email sent!' });
  } catch (error) {
    console.error('SendGrid test error:', error.response?.body || error);
    res.status(400).json({ 
      error: error.message,
      details: error.response?.body 
    });
  }
});

// Test endpoint for storage debugging
app.get('/test-storage', async (req, res) => {
  try {
    // List files in the ebook bucket
    const { data: files, error: listError } = await supabase
      .storage
      .from('ebook')
      .list();

    if (listError) {
      console.log('Storage list error:', listError);
      return res.status(400).json({ error: 'Storage list failed', details: listError });
    }

    console.log('Files in ebook bucket:', files);
    res.json({ files: files });
  } catch (error) {
    console.error('Storage test error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { bookId, userId, email } = req.body;

  // Fetch book info from Supabase
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single();

  if (error || !book) {
    return res.status(400).json({ error: 'Book not found' });
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: book.title,
          description: book.description,
          images: [book.cover_image_url],
        },
        unit_amount: Math.round(Number(book.price) * 100), // Stripe expects cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    customer_email: email, // Pass user's email from frontend
    success_url: 'http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:8080/cancel',
    metadata: {
      book_id: bookId,
      user_id: userId,
    },
    invoice_creation: { enabled: true }, // Stripe will send invoice/receipt
  });

  res.json({ url: session.url });
});

// Stripe webhook endpoint uses raw body parser
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { book_id, user_id } = session.metadata;
    const email = session.customer_email;

    try {
      // 1. Check if order already exists for this session
      const { data: existingOrder, error: checkError } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_session_id', session.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error if not found

      if (existingOrder) {
        console.log('Order already exists for session:', session.id);
        return res.json({ received: true, message: 'Order already processed' });
      }

      // 2. Create order in Supabase and get the order ID
      const { data: orderInsert, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id,
          book_id,
          status: 'paid',
          total_amount: session.amount_total / 100,
          stripe_session_id: session.id, // Add this field to prevent duplicates
        }])
        .select('id')
        .single();

      if (orderError || !orderInsert) {
        console.log('Order insert error:', orderError);
        return res.status(400).send('Order insert failed');
      }
      const orderId = orderInsert.id;
      console.log('Order created with ID:', orderId);

      // Respond to Stripe immediately to prevent retries
      res.json({ received: true });

      // Continue processing in background
      // 3. Fetch the book to get the ebook filename and title
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('ebook, title')
        .eq('id', book_id)
        .single();

      if (bookError || !bookData) {
        console.log('Book fetch error:', bookError);
        throw new Error('Book not found');
      }

      console.log('Book data found:', bookData);
      console.log('Ebook filename:', bookData.ebook);

      // 4. Generate signed URL for the book PDF in the 'ebook' bucket
      const { data: signedUrlData, error: urlError } = await supabase
        .storage
        .from('ebook')
        .createSignedUrl(bookData.ebook, 60 * 60 * 24); // 24 hours

      if (urlError) {
        console.log('Signed URL error:', urlError);
        throw urlError;
      }

      console.log('Signed URL generated successfully');

      // 5. Send email with SendGrid (centered, themed for Whispering Tomes)
      const htmlContent = `
      <table style="width:100%; max-width:600px; margin:auto; font-family:'Cormorant Garamond', Garamond, 'Times New Roman', serif; background:#10141A; border:1px solid #C9B037; border-radius:12px; box-shadow:0 4px 24px #00000040; color:#F5E9D0; text-align:center;">
        <tr>
          <td style="background:#10141A; color:#C9B037; padding:32px 36px 18px 36px; border-radius:12px 12px 0 0;">
            <h2 style="margin:0; font-size:2.4em; letter-spacing:2px; font-family:'Cormorant Garamond', Garamond, serif; font-weight:700;">KIA BENISTON</h2>
          </td>
        </tr>
        <tr>
          <td style="background:#10141A; color:#F5E9D0; padding:0 36px 32px 36px;">
            <blockquote style="font-style:italic; color:#F5E9D0; font-size:1.15em; margin:24px auto 32px auto; max-width:90%;">In the silence of ancient libraries, whispers of forgotten wisdom await those who dare to listen. The pages of history hold secrets that transcend time itself.</blockquote>
            <div style="color:#C9B037; font-size:1.3em; font-weight:600; margin-bottom:18px;">Thank You for Your Order!</div>
            <p style="font-size:1.1em; margin-bottom:18px;">Hi <span style="color:#C9B037;">${email.split('@')[0]}</span>,</p>
            <p style="margin-bottom:18px;">Thank you for purchasing <span style="color:#C9B037; font-weight:bold;">${bookData.title}</span>!</p>
            <p style="margin-bottom:18px;">Your order ID is <span style="color:#C9B037; font-family:monospace;">#${orderId}</span>.</p>
            <hr style="border:none; border-top:1px solid #C9B03733; margin:24px 0;">
            <div style="margin-bottom:18px;">
              <span style="font-weight:bold; color:#C9B037;">Your download link (expires in 24 hours):</span><br>
              <a href="${signedUrlData.signedUrl}" style="display:inline-block; margin:18px auto 0 auto; background:#C9B037; color:#10141A; padding:14px 36px; border-radius:6px; text-decoration:none; font-weight:bold; letter-spacing:1px; font-size:1.1em; box-shadow:0 2px 8px #00000020;">Download your book</a>
            </div>
            <p style="color:#B8A77A; font-size:1em; margin-top:32px;">If you have any issues, just reply to this email.<br>Enjoy your reading adventure!</p>
          </td>
        </tr>
        <tr>
          <td style="background:#181A1B; color:#C9B037; text-align:center; padding:18px; border-radius:0 0 12px 12px; font-size:1em; letter-spacing:1px;">
            &copy; ${new Date().getFullYear()} Whispering Tomes. All rights reserved.
          </td>
        </tr>
      </table>
      `;

      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'rikhilprakash383@gmail.com',
        subject: `Your Book Purchase: ${bookData.title}`,
        html: htmlContent,
      });

      console.log('Email sent successfully');

    } catch (error) {
      console.error('Webhook processing error:', error);
    }
  } else {
    res.json({ received: true });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));