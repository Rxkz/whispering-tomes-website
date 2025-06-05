import { Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy/70 border-t border-gold/20 mt-20">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Author Information */}
          <div className="space-y-4">
            <h3 className="text-gold font-cormorant text-2xl font-semibold tracking-wider">Kia Beniston</h3>
            <p className="text-antique/70 max-w-md">
              Crafting worlds of mystery and wonder through the written word, 
              exploring the depths of imagination and the heights of human experience.
            </p>
            <div className="flex space-x-4 text-gold">
              <a href="#" className="hover:text-ivory transition-colors duration-300">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="hover:text-ivory transition-colors duration-300">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="hover:text-ivory transition-colors duration-300">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="hover:text-ivory transition-colors duration-300">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-gold font-cormorant text-2xl font-semibold tracking-wider">EXPLORE</h3>
            <ul className="space-y-2 font-garamond">
              <li><a href="/" className="text-antique/70 hover:text-gold transition-colors duration-300">Home</a></li>
              <li><a href="/about" className="text-antique/70 hover:text-gold transition-colors duration-300">About</a></li>
              <li><a href="/books" className="text-antique/70 hover:text-gold transition-colors duration-300">Books</a></li>
              <li><a href="/gallery" className="text-antique/70 hover:text-gold transition-colors duration-300">Gallery</a></li>
            </ul>
          </div>
          
          {/* Newsletter Signup */}
          <div className="space-y-4">
            <h3 className="text-gold font-cormorant text-2xl font-semibold tracking-wider">NEWSLETTER</h3>
            <p className="text-antique/70">Subscribe to receive updates about new releases and events.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-navy/50 border border-gold/30 rounded px-4 py-2 text-ivory focus:outline-none focus:border-gold"
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
        
        <div className="border-t border-gold/20 mt-8 pt-8 text-center text-antique/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Kia Beniston. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
