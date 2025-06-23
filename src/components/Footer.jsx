import React from "react";

const Footer = () => (
  <footer className="bg-navy text-ivory border-t border-gold/20">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 pb-8 px-4">
      {/* Left: Author Info */}
      <div>
        <h2 className="text-gold font-cormorant text-xl mb-2">Kia Beniston</h2>
        <p className="mb-4 text-antique/80">
          Crafting worlds of mystery and wonder through the written word, exploring the depths of imagination and the heights of human experience.
        </p>
        <div className="flex space-x-4 text-gold text-xl">
          <a href="#" aria-label="Facebook" className="hover:text-amber-400 transition-colors">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-amber-400 transition-colors">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406c-.98.98-1.274 2.092-1.334 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.06 1.282.354 2.394 1.334 3.374.98.98 2.092 1.274 3.374 1.334C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.06 2.394-.354 3.374-1.334.98-.98 1.274-2.092 1.334-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.06-1.282-.354-2.394-1.334-3.374-.98-.98-2.092-1.274-3.374-1.334C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-amber-400 transition-colors">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.93-.888 2.011-.888 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A9.936 9.936 0 0 0 24 4.557z"/></svg>
          </a>
          <a href="mailto:author@email.com" aria-label="Email" className="hover:text-amber-400 transition-colors">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12.713l-11.985-9.713h23.97zm11.985-11.713h-23.97c-.552 0-1 .447-1 1v20c0 .553.448 1 1 1h23.97c.553 0 1-.447 1-1v-20c0-.553-.447-1-1-1zm-11.985 13.287l-11.985-9.713v18.426zm1.5-1.5l11.985 9.713v-18.426zm-1.5 1.5l-11.985 9.713h23.97z"/></svg>
          </a>
        </div>
      </div>
      {/* Center: Navigation */}
      <div>
        <h2 className="text-gold font-cormorant text-xl mb-2">EXPLORE</h2>
        <ul className="space-y-2">
          <li><a href="/" className="hover:text-gold">Home</a></li>
          <li><a href="/about" className="hover:text-gold">About</a></li>
          <li><a href="/books" className="hover:text-gold">Books</a></li>
          <li><a href="/gallery" className="hover:text-gold">Gallery</a></li>
        </ul>
      </div>
      {/* Right: Newsletter */}
      <div>
        <h2 className="text-gold font-cormorant text-xl mb-2">NEWSLETTER</h2>
        <p className="mb-4 text-antique/80">
          Subscribe to receive updates about new releases and events.
        </p>
        <form className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Your email"
            className="bg-navy border border-gold/30 rounded px-4 py-2 text-ivory focus:outline-none focus:border-gold flex-grow"
          />
          <button
            type="submit"
            className="bg-gold text-navy px-4 py-2 rounded font-cormorant uppercase tracking-widest text-sm hover:bg-gold/80 transition"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>
    {/* Bottom: Copyright */}
    <div className="border-t border-gold/10 mt-8 pt-8 text-center text-antique/60 text-sm">
      © 2025 Kia Beniston. All rights reserved.
    </div>
  </footer>
);

export default Footer;
