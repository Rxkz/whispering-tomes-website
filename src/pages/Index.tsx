import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [bookHovered, setBookHovered] = useState(false);
  const [dustParticles, setDustParticles] = useState<Array<{id: number, size: number, x: number, y: number, delay: number}>>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  // Newsletter subscribe states
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  // Generate dust particles
  useEffect(() => {
    if (!heroRef.current) return;
    
    const particles = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    
    setDustParticles(particles);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with 3D Book */}
      <div 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setBookHovered(true)}
        onMouseLeave={() => setBookHovered(false)}
      >
        {/* Dust particles */}
        {dustParticles.map((particle) => (
          <div 
            key={particle.id}
            className="dust-particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: 0,
              animationDelay: `${particle.delay}s`,
              '--dust-x': `${(Math.random() * 200) - 100}px`,
              '--dust-y': `${(Math.random() * 200) - 100}px`
            } as React.CSSProperties}
          />
        ))}
        
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-navy/40 z-0">
          <div className="absolute inset-0 bg-[url('/textures/library-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-cormorant font-bold text-ivory leading-tight">
                <span className="inline-block">Discover</span> <br />
                <span className="text-gold inline-block animate-fade-in">The Secret Library</span>
              </h1>
              
              <p className="text-xl text-antique/80 max-w-lg mx-auto md:mx-0">
                Enter a world where ancient knowledge and forgotten tales await discovery. 
                Join the journey through pages filled with mystery and wonder.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/books" className="gold-btn">
                  Explore Books
                </Link>
                <Link to="/about" className="border border-antique/40 hover:border-gold text-antique hover:text-gold py-2 px-6 rounded transition-all duration-300 font-cormorant uppercase tracking-widest text-sm">
                  About Author
                </Link>
              </div>
            </div>
            
            <div className="h-[500px]">
              <iframe 
                src="/3dbook.html" 
                title="3D Book" 
                width="100%" 
                height="500" 
                style={{ border: 'none', background: 'transparent' }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="animate-bounce text-gold/70">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Featured Books Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-cormorant font-bold text-gold mb-12 text-center">
            <span className="relative inline-block">
              Featured Works
              <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gold/30"></span>
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((book) => (
              <div 
                key={book}
                className="relative group"
              >
                <div className="book-page h-full transform group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="aspect-[2/3] bg-forest/20 mb-4 overflow-hidden">
                    <img 
                      src={`/textures/book-cover-${book}.jpg`} 
                      alt={`Book ${book}`} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-cormorant font-semibold text-gold">Book Title {book}</h3>
                  <p className="text-sm text-ivory/70 mt-2">
                    A captivating journey through ancient mysteries and forgotten knowledge.
                  </p>
                  <div className="mt-4">
                    <Link to="/books" className="text-gold hover:text-ivory transition-colors duration-300 text-sm uppercase tracking-wider font-cormorant">
                      Discover More &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Author Quote */}
      <section className="py-20 px-4 bg-forest/10">
        <div className="container mx-auto max-w-3xl text-center">
          <svg className="w-12 h-12 mx-auto text-gold/50 mb-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-2xl md:text-3xl font-cormorant italic text-ivory">
            In the silence of ancient libraries, whispers of forgotten wisdom await those who dare to listen. The pages of history hold secrets that transcend time itself.
          </blockquote>
          <div className="mt-6">
            <p className="text-gold font-cormorant text-xl">Author Name</p>
          </div>
        </div>
      </section>
      
      {/* Newsletter CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="book-page p-10 text-center">
            <h2 className="text-3xl font-cormorant font-bold text-gold mb-4">
              Join the Journey
            </h2>
            <p className="text-ivory/80 mb-8 max-w-xl mx-auto">
              Subscribe to receive exclusive content, early access to new releases, and invitations to special events.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-4 justify-center"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setMessage(null);
                try {
                  const res = await fetch(
                    "https://sbywbwrhcrmtbbmsupbm.supabase.co/functions/v1/newsletter-subscribe",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        to: email,
                        subject: "Thanks for subscribing!",
                        html: `<p>Thank you for subscribing to our newsletter. You'll receive updates soon!</p>`
                      })
                    }
                  );
                  const data = await res.json();
                  if (res.ok) {
                    setMessage("Subscription successful! Please check your email.");
                    setEmail("");
                  } else {
                    setMessage(data.error?.message || "Failed to subscribe. Please try again.");
                  }
                } catch (err) {
                  setMessage("An error occurred. Please try again later.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="bg-navy/50 border border-gold/30 rounded px-4 py-3 text-ivory focus:outline-none focus:border-gold flex-grow max-w-md"
                aria-label="Email for newsletter"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="submit"
                className="gold-btn"
                disabled={loading || !email}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {message && (
              <div className="mt-4 text-gold font-cormorant text-lg">{message}</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
