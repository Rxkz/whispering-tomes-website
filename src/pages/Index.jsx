import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import NewsletterForm from '../components/NewsletterForm';

const Index = () => {
  const [bookHovered, setBookHovered] = useState(false);
  const [dustParticles, setDustParticles] = useState([]);
  const heroRef = useRef(null);
  
  // Generate dust particles
  useEffect(() => {
    if (!heroRef.current) return;
    
    const particles = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      size: Math.random() * 3 + 1, // 3 to 5px
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
              opacity: 0.85,
              background: 'radial-gradient(circle, #FFD700 60%, #fffbe6 100%)',
              borderRadius: '50%',
              boxShadow: '0 0 12px 4px #FFD700, 0 0 24px 8px #fffbe6',
              position: 'absolute',
              animationDelay: `${particle.delay}s`,
              '--dust-x': `${(Math.random() * 200) - 100}px`,
              '--dust-y': `${(Math.random() * 200) - 100}px`
            }}
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
            
            {/* 3D Book with wiggle and scale on hover, responsive and shifted right on desktop */}
            <div 
              className="group flex items-center justify-center transition-transform duration-300 h-[700px] w-[130%] ml-0 md:ml-12 lg:ml-24 mx-auto md:h-[700px] md:w-[130%] sm:h-[400px] sm:w-full sm:ml-0" 
            >
              <div 
                className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:animate-wiggle"
                style={{ willChange: 'transform' }}
              >
                <iframe 
                  src="/3dbook.html" 
                  title="3D Book" 
                  width="100%" 
                  height="700" 
                  className="sm:h-[400px] md:h-[700px]"
                  style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                  allowFullScreen
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
            {/* First featured book - MADE OF NOISE */}
            <div className="relative group">
              <div className="book-page h-full transform group-hover:-translate-y-2 transition-transform duration-300">
                <div className="aspect-[2/3] bg-forest/20 mb-4 overflow-hidden flex items-center justify-center">
                  <iframe
                    src="/3dbook.html?cover=cover.jpg&title=MADE%20OF%20NOISE"
                    title="3D Book Card Made of Noise"
                    width="100%"
                    height="500"
                    className="w-full h-[500px]"
                    style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                    allowFullScreen
                  />
                </div>
                <h3 className="text-2xl font-cormorant font-semibold text-gold">MADE OF NOISE</h3>
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
            {/* Book 2 - Ronaldo */}
            <div className="relative group">
              <div className="book-page h-full transform group-hover:-translate-y-2 transition-transform duration-300">
                <div className="aspect-[2/3] bg-forest/20 mb-4 overflow-hidden flex items-center justify-center">
                  <iframe
                    src="/3dbook.html?cover=cr7.jpg&title=Ronaldo&color=f1c40f&txtcolor=000000"
                    title="3D Book Card Ronaldo"
                    width="100%"
                    height="500"
                    className="w-full h-[500px]"
                    style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                    allowFullScreen
                  />
                </div>
                <h3 className="text-2xl font-cormorant font-semibold text-gold">Ronaldo</h3>
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
            {/* Book 3 - Messi */}
            <div className="relative group">
              <div className="book-page h-full transform group-hover:-translate-y-2 transition-transform duration-300">
                <div className="aspect-[2/3] bg-forest/20 mb-4 overflow-hidden flex items-center justify-center">
                  <iframe
                    src="/3dbook.html?cover=messi.jpg&title=Messi&color=f1c40f"
                    title="3D Book Card Messi"
                    width="100%"
                    height="500"
                    className="w-full h-[500px]"
                    style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                    allowFullScreen
                  />
                </div>
                <h3 className="text-2xl font-cormorant font-semibold text-gold">Messi</h3>
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
            <p className="text-gold font-cormorant text-xl">K BENISTON</p>
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
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

<style jsx global>{`
@keyframes wiggle {
  0% { transform: rotate(-2deg) scale(1.05); }
  20% { transform: rotate(2deg) scale(1.07); }
  40% { transform: rotate(-2deg) scale(1.09); }
  60% { transform: rotate(2deg) scale(1.07); }
  80% { transform: rotate(-2deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1.05); }
}
.animate-wiggle {
  animation: wiggle 0.7s ease-in-out;
}
`}</style>
