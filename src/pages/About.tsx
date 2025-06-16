import { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';

const About = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  // Contact form states
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    const image = new Image();
    image.src = '/Goat.jpg';
    image.onload = () => setIsImageLoaded(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    emailjs.send(
      'service_wjz3oia',
      'template_pjy89l4',
      {
        from_name: form.name,
        from_email: form.email,
        subject: form.subject,
        message: form.message,
        current_date: new Date().toLocaleString()
      },
      'Cg9lzCetBWOJH-vs4'
    )
    .then(() => {
      setResult('Message sent! Thank you for reaching out.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, () => {
      setResult('Failed to send. Please try again.');
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-gold text-center mb-16">
          <span className="relative inline-block">
            About the Author
            <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gold/30"></span>
          </span>
        </h1>
        
        {/* Author Bio Section - Book Page Design */}
        <div className="book-page p-8 md:p-12 max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Author Image with Ornate Frame */}
            <div className="relative flex justify-center">
              <div className="ornate-frame">
                <div className={`relative transition-opacity duration-1000 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <img 
                    src="public\Goat.jpg" 
                    alt="Kia Beniston" 
                    className="rounded-sm"
                  />
                  <div className="absolute inset-0 bg-gold/10 mix-blend-overlay"></div>
                </div>
              </div>
            </div>
            
            {/* Author Bio */}
            <div className="space-y-6 text-ivory/90">
              <h2 className="font-cormorant text-3xl font-semibold text-gold">Kia Beniston</h2>
              <div className="space-y-4">
                <p>
                  Born in the misty valleys of a forgotten countryside, I developed an early fascination with ancient manuscripts and the stories they contained. 
                  My childhood was spent exploring dusty bookshops and imagining worlds beyond our own.
                </p>
                <p>
                  After studying Classical Literature and Archaeology at university, I embarked on a journey across Europe, researching forgotten libraries and uncovering tales that had been lost to time.
                </p>
                <p>
                  Now, I craft stories that blend historical mysteries with elements of the supernatural, inviting readers to venture into realms where knowledge is the most powerful magic and ancient secrets await discovery.
                </p>
              </div>
              <div className="pt-2">
                <p className="text-gold italic font-cormorant text-xl">
                  "I write to explore the shadows between what is known and what remains hidden."
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Writing Process Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-cormorant font-bold text-gold text-center mb-10">
            <span className="relative inline-block">
              The Writing Process
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gold/30"></span>
            </span>
          </h2>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-full bg-navy border-2 border-gold/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-cormorant font-semibold text-gold mb-3">Research</h3>
                <p className="text-ivory/80">
                  Each story begins with extensive research into historical archives, ancient manuscripts, and forgotten folklore. I spend months exploring libraries and historical sites, gathering fragments of the past that will form the foundation of my narratives.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-full bg-navy border-2 border-gold/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-cormorant font-semibold text-gold mb-3">Drafting</h3>
                <p className="text-ivory/80">
                  I draft by candlelight in the early hours of morning when the veil between worlds feels thinnest. Using a blend of traditional methods—ink on parchment—and modern tools, I allow the characters to guide the narrative, often surprising even myself with where the journey leads.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-full bg-navy border-2 border-gold/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-cormorant font-semibold text-gold mb-3">Revision</h3>
                <p className="text-ivory/80">
                  Revision is where the true magic happens. I refine each sentence until the prose achieves a delicate balance between atmospheric description and compelling narrative. This process often takes longer than the initial writing, as I layer in historical details and subtle foreshadowing.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-cormorant font-bold text-gold text-center mb-10">
            <span className="relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gold/30"></span>
            </span>
          </h2>
          
          <div className="book-page p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-gold font-cormorant mb-2">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-navy/50 border border-gold/30 rounded px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gold font-cormorant mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-navy/50 border border-gold/30 rounded px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gold font-cormorant mb-2">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-navy/50 border border-gold/30 rounded px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gold font-cormorant mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-navy/50 border border-gold/30 rounded px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                ></textarea>
              </div>
              
              <div>
                <button type="submit" className="gold-btn w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
              {result && (
                <div className="text-center text-gold font-cormorant mt-4">{result}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
