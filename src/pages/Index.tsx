
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Hero3DBook from '../components/Hero3DBook';
import { ArrowRight, ShoppingCart } from 'lucide-react';

const Index = () => {
  const [bookHovered, setBookHovered] = useState(false);
  const [dustParticles, setDustParticles] = useState<Array<{id: number, size: number, x: number, y: number, delay: number}>>([]);
  const [scrollY, setScrollY] = useState(0);
  const [bookFixed, setBookFixed] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const purchaseSectionRef = useRef<HTMLDivElement>(null);
  const bookWrapperRef = useRef<HTMLDivElement>(null);
  
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

  // Handle scroll for book positioning
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      if (purchaseSectionRef.current && bookWrapperRef.current) {
        const purchaseTop = purchaseSectionRef.current.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        
        // Set the book to fixed position when it should follow scroll
        if (purchaseTop < viewportHeight * 0.8 && purchaseTop > 0) {
          setBookFixed(true);
        } else {
          setBookFixed(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate the maximum translation value to limit the book's movement
  const maxTranslateValue = 40; // value in viewport width units
  const translateX = Math.min(scrollY * 0.1, maxTranslateValue);

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
                <a href="#purchase-section" className="gold-btn group flex items-center justify-center gap-2">
                  <span>Purchase Now</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </a>
                <Link to="/about" className="border border-antique/40 hover:border-gold text-antique hover:text-gold py-2 px-6 rounded transition-all duration-300 font-cormorant uppercase tracking-widest text-sm">
                  About Author
                </Link>
              </div>
            </div>
            
            <div 
              ref={bookWrapperRef}
              className={`h-[500px] ${bookFixed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            >
              <div className="block h-full">
                <Hero3DBook 
                  isHovered={bookHovered} 
                  bookTitle="The Secret Library" 
                  bookAuthor="Author Name"
                />
              </div>
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
      
      {/* Floating Book that follows scroll */}
      <div 
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 w-[300px] h-[400px] z-30 transition-all duration-700 ease-out pointer-events-none
          ${bookFixed ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transform: `translate3d(${translateX}vw, -50%, 0)`,
        }}
      >
        <Hero3DBook 
          isHovered={true}
          isOpened={bookFixed}
          bookTitle="The Secret Library" 
          bookAuthor="Author Name"
        />
      </div>
      
      {/* Purchase Section */}
      <section 
        ref={purchaseSectionRef}
        id="purchase-section" 
        className="py-20 px-4 min-h-screen flex items-center"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Left side - invisible placeholder that takes space for the fixed book */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="h-[500px] w-full"></div>
            </div>
            
            {/* Right side - purchase options */}
            <div className="lg:col-span-3 space-y-8">
              <div className="book-page p-8 relative overflow-hidden">
                <h2 className="text-4xl font-cormorant font-bold text-gold mb-6">The Secret Library</h2>
                
                <div className="absolute top-4 right-4 w-16 h-16">
                  <img src="/lovable-uploads/84e305e7-527f-46e3-a6e6-13dd2463c76d.png" alt="Authentic Seal" className="w-full h-full object-contain" />
                </div>
                
                <p className="text-ivory/90 text-lg mb-8 font-baskerville italic">
                  A journey through the forgotten corridors of knowledge, where ancient wisdom and mystical secrets are preserved in pages touched by time itself.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                  <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-gold text-xl font-cormorant">Hardcover Edition</h3>
                    <p className="text-antique/80">Premium binding with gold-embossed detail</p>
                    <p className="text-2xl font-cormorant text-gold">$35.99</p>
                    <button className="relative group w-full max-w-[180px] hover:scale-105 transition-transform duration-300">
                      <img src="/textures/wax-seal-2.png" alt="Purchase" className="w-full h-auto" />
                      <span className="absolute inset-0 flex items-center justify-center text-navy font-cormorant font-semibold">Purchase</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-gold text-xl font-cormorant">Digital Edition</h3>
                    <p className="text-antique/80">Instant access on all your devices</p>
                    <p className="text-2xl font-cormorant text-gold">$19.99</p>
                    <button className="relative group w-full max-w-[180px] hover:scale-105 transition-transform duration-300">
                      <img src="/textures/wax-seal-2.png" alt="Purchase" className="w-full h-auto" />
                      <span className="absolute inset-0 flex items-center justify-center text-navy font-cormorant font-semibold">Purchase</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center flex-wrap gap-4 text-antique/70 text-sm mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <span>Free shipping on orders over $50</span>
                  <span className="h-1 w-1 bg-gold rounded-full hidden md:block"></span>
                  <span>30-day money back guarantee</span>
                </div>
              </div>
              
              <div className="book-page p-8 relative overflow-hidden animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <h3 className="text-2xl font-cormorant font-bold text-gold mb-4">Sample Chapter</h3>
                <div className="border-l-2 border-gold/30 pl-6 text-ivory/90 font-baskerville">
                  <p className="mb-4 first-letter:text-3xl first-letter:font-bold first-letter:text-gold first-letter:mr-1 first-letter:float-left">
                    The ancient library stood silent as the centuries that had passed within its walls. Dust motes danced in the shafts of light that pierced the gloom, illuminating shelves that groaned under the weight of forgotten knowledge.
                  </p>
                  <p className="mb-4">
                    As I moved deeper into the labyrinth of bookshelves, the air grew thick with the scent of aged parchment and leather bindings. Each step echoed against the marble floor, a rhythmic reminder that I was but a temporary visitor in a place where time itself seemed to slow.
                  </p>
                  <p>
                    It was then that I saw it—a tome bound in deep crimson leather, its spine adorned with symbols I had never encountered in all my years of study...
                  </p>
                </div>
                <div className="h-4 w-full bg-[url('/textures/deckled-edge.png')] bg-repeat-x bg-bottom absolute bottom-0 left-0 opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Author Quote */}
      <section className="py-20 px-4 bg-forest/10">
        <div className="container mx-auto max-w-3xl text-center animate-fade-in">
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
          <div className="book-page p-10 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-cormorant font-bold text-gold mb-4">
              Join the Journey
            </h2>
            <p className="text-ivory/80 mb-8 max-w-xl mx-auto">
              Subscribe to receive exclusive content, early access to new releases, and invitations to special events.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-navy/50 border border-gold/30 rounded px-4 py-3 text-ivory focus:outline-none focus:border-gold flex-grow max-w-md"
                aria-label="Email for newsletter"
              />
              <button 
                type="submit" 
                className="gold-btn"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
