import React, { useEffect, useState } from 'react';
import Hero3DBook from '../components/Hero3DBook';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';

interface Book {
  id: number;
  title: string;
  cover: string;
  description: string;
  price: string;
  releaseDate: string;
  pages: number;
  excerpt: string;
  cover_image_url: string;
  author: string;
}

const Books = () => {
  const { user, isAdmin } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [openBook, setOpenBook] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (error) {
        setError('Failed to fetch books');
      } else {
        setBooks(data || []);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setTimeout(() => setOpenBook(true), 300);
  };
  
  const handleClose = () => {
    setOpenBook(false);
    setTimeout(() => setSelectedBook(null), 500);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    await supabase.from('books').delete().eq('id', id);
    setBooks(books.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-gold text-center mb-16">
          <span className="relative inline-block">
            Books
            <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gold/30"></span>
          </span>
        </h1>
        
        {/* Books Display */}
        {loading ? (
          <div className="text-center text-gold">Loading books...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {books.map((book) => (
              <div
                key={book.id}
                className="flex flex-col book-page overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer relative"
                onClick={() => handleBookClick(book)}
              >
                <div className="aspect-[2/3] relative overflow-hidden mb-4 flex items-center justify-center">
                  <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent flex items-end p-4">
                    <h2 className="text-gold text-xl font-cormorant font-semibold">{book.title}</h2>
                  </div>
                </div>
                <p className="text-ivory/80 line-clamp-3 mb-4 text-sm flex-grow">{book.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-gold font-cormorant">${book.price}</span>
                  <button className="text-antique hover:text-gold text-sm uppercase tracking-wider font-cormorant transition-colors duration-300">
                    Explore &rarr;
                  </button>
                </div>
                {isAdmin && (
                  <button
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs z-10 hover:bg-red-700"
                    onClick={(e) => { e.stopPropagation(); handleDelete(book.id); }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Book Detail Modal */}
        {selectedBook && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${openBook ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-navy/95 backdrop-blur-sm" onClick={handleClose}></div>
            
            <div className={`relative bg-navy border border-gold/30 max-w-6xl w-full max-h-[90vh] overflow-y-auto transition-transform duration-500 ${openBook ? 'scale-100' : 'scale-95'}`}>
              <button 
                className="absolute top-4 right-4 text-gold hover:text-ivory z-10"
                onClick={handleClose}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* 3D Book Display */}
                <div className="h-[500px] bg-navy/50 flex items-center justify-center">
                  {selectedBook && selectedBook.id === 1 && (
                    <iframe
                      src="/3dbook.html?cover=cover.jpg&title=The%20Secret%20Library&color=2dd4bf&txtcolor=ffffff"
                      title="3D Book Card The Secret Library"
                      width="100%"
                      height="500"
                      className="w-full h-[500px]"
                      style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                      allowFullScreen
                    />
                  )}
                  {selectedBook && selectedBook.id === 2 && (
                    <iframe
                      src="/3dbook.html?cover=cr7.jpg&title=Ronaldo&color=1abc9c&txtcolor=ffffff"
                      title="3D Book Card Ronaldo"
                      width="100%"
                      height="500"
                      className="w-full h-[500px]"
                      style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                      allowFullScreen
                    />
                  )}
                  {selectedBook && selectedBook.id === 3 && (
                    <iframe
                      src="/3dbook.html?cover=messi.jpg&title=Messi&color=f1c40f&txtcolor=000000"
                      title="3D Book Card Messi"
                      width="100%"
                      height="500"
                      className="w-full h-[500px]"
                      style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                      allowFullScreen
                    />
                  )}
                  {selectedBook && selectedBook.id > 3 && (
                    <iframe
                      src={`/3dbook.html?cover=${encodeURIComponent(selectedBook.cover.replace(/^\//, ''))}&title=${encodeURIComponent(selectedBook.title)}&color=2dd4bf&txtcolor=ffffff`}
                      title={`3D Book Card ${selectedBook.title}`}
                      width="100%"
                      height="500"
                      className="w-full h-[500px]"
                      style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                      allowFullScreen
                    />
                  )}
                </div>
                
                {/* Book Details */}
                <div className="book-page p-8">
                  <h2 className="text-3xl font-cormorant font-bold text-gold mb-4">{selectedBook.title}</h2>
                  <p className="text-ivory/80 mb-6">{selectedBook.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-gold font-cormorant text-sm uppercase tracking-wide">Price</h3>
                      <p className="text-ivory">${selectedBook.price}</p>
                    </div>
                    <div>
                      <h3 className="text-gold font-cormorant text-sm uppercase tracking-wide">Author</h3>
                      <p className="text-ivory">{selectedBook.author}</p>
                    </div>
                    <div>
                      <h3 className="text-gold font-cormorant text-sm uppercase tracking-wide">Release Date</h3>
                      <p className="text-ivory">{selectedBook.releaseDate}</p>
                    </div>
                    <div>
                      <h3 className="text-gold font-cormorant text-sm uppercase tracking-wide">Pages</h3>
                      <p className="text-ivory">{selectedBook.pages}</p>
                    </div>
                    <div>
                      <h3 className="text-gold font-cormorant text-sm uppercase tracking-wide">Format</h3>
                      <p className="text-ivory">Hardcover, E-book</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-gold font-cormorant text-lg mb-2">Excerpt</h3>
                    <div className="bg-navy/50 border border-gold/20 p-4 text-ivory/90 italic">
                      "{selectedBook.excerpt}"
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="gold-btn flex-1">Purchase</button>
                    <button className="border border-gold/30 hover:border-gold text-antique hover:text-gold py-2 px-6 rounded transition-all duration-300 flex-1 font-cormorant uppercase tracking-widest text-sm">
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Upcoming Releases */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-cormorant font-bold text-gold text-center mb-10">
            <span className="relative inline-block">
              Upcoming Releases
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gold/30"></span>
            </span>
          </h2>
          
          <div className="book-page p-8">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 w-full md:w-48">
                  <div className="aspect-[2/3] bg-forest/20 overflow-hidden">
                    <img 
                      src="/textures/upcoming-book.jpg" 
                      alt="Upcoming Book" 
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-cormorant font-semibold text-gold mb-2">The Alchemist's Codex</h3>
                  <p className="text-sm text-antique/60 mb-4">Coming December 2025</p>
                  <p className="text-ivory/80 mb-4">
                    A mathematics professor discovers that a seemingly innocuous sequence of numbers in an ancient alchemical text may hold the key to unlocking the boundaries between dimensions.
                  </p>
                  <button className="text-gold hover:text-ivory transition-colors duration-300 text-sm uppercase tracking-wider font-cormorant">
                    Join Waiting List
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gold/20 pt-8">
                <h3 className="text-2xl font-cormorant font-semibold text-gold mb-6">Preorder Benefits</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-gold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-ivory font-semibold">Signed First Edition</h4>
                      <p className="text-antique/70 text-sm">Receive a personally signed first edition with custom bookplate</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-gold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-ivory font-semibold">Exclusive Digital Content</h4>
                      <p className="text-antique/70 text-sm">Access to author's notes, research materials, and deleted scenes</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-gold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-ivory font-semibold">Early Access</h4>
                      <p className="text-antique/70 text-sm">Receive your copy two weeks before the official release date</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
