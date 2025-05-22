
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, User, Paintbrush, Home } from 'lucide-react';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-navy/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="font-cormorant text-2xl font-semibold text-gold tracking-widest"
        >
          AUTHOR NAME
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-ivory hover:text-gold"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        {/* Desktop menu */}
        <div className="hidden md:flex space-x-8">
          <Link 
            to="/" 
            className={`nav-item flex items-center gap-1 ${isActive('/') ? 'text-gold border-b border-gold' : ''}`}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link 
            to="/about" 
            className={`nav-item flex items-center gap-1 ${isActive('/about') ? 'text-gold border-b border-gold' : ''}`}
          >
            <User size={16} />
            <span>About</span>
          </Link>
          <Link 
            to="/books" 
            className={`nav-item flex items-center gap-1 ${isActive('/books') ? 'text-gold border-b border-gold' : ''}`}
          >
            <Book size={16} />
            <span>Books</span>
          </Link>
          <Link 
            to="/gallery" 
            className={`nav-item flex items-center gap-1 ${isActive('/gallery') ? 'text-gold border-b border-gold' : ''}`}
          >
            <Paintbrush size={16} />
            <span>Gallery</span>
          </Link>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden absolute w-full bg-navy/95 backdrop-blur-lg transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-60 border-b border-gold/30' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link 
            to="/" 
            className={`nav-item flex items-center gap-2 ${isActive('/') ? 'text-gold' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link 
            to="/about" 
            className={`nav-item flex items-center gap-2 ${isActive('/about') ? 'text-gold' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <User size={16} />
            <span>About</span>
          </Link>
          <Link 
            to="/books" 
            className={`nav-item flex items-center gap-2 ${isActive('/books') ? 'text-gold' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <Book size={16} />
            <span>Books</span>
          </Link>
          <Link 
            to="/gallery" 
            className={`nav-item flex items-center gap-2 ${isActive('/gallery') ? 'text-gold' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <Paintbrush size={16} />
            <span>Gallery</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
