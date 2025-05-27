import { useState } from 'react';
import Hero3DBook from '../components/Hero3DBook';

interface Book {
  id: number;
  title: string;
  cover: string;
  description: string;
  price: string;
  releaseDate: string;
  pages: number;
  excerpt: string;
}

const Books = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [openBook, setOpenBook] = useState(false);
  
  const books: Book[] = [
    {
      id: 1,
      title: "The Secret Library",
      cover: "/textures/book-cover-1.jpg",
      description: "A centuries-old mystery unfolds when a librarian discovers a hidden chamber beneath an ancient university, containing texts that were thought to be lost to history.",
      price: "$24.99",
      releaseDate: "June 15, 2024",
      pages: 384,
      excerpt: "The dust scattered as Helena's fingers traced the spine of the ancient tome. Its leather binding, cracked with age, seemed to pulse beneath her touch as if awakening from a centuries-long slumber. The restricted section of the university library had always been her sanctuary, but tonight, something felt different in the air—a whisper of secrets waiting to be unveiled."
    },
    {
      id: 2,
      title: "Whispers of the Ancients",
      cover: "/textures/book-cover-2.jpg",
      description: "When an archaeology professor translates a forgotten manuscript, she unwittingly becomes entangled in a web of ancient societies and dangerous knowledge.",
      price: "$22.99",
      releaseDate: "October 31, 2023",
      pages: 412,
      excerpt: "Professor Eliza Morgan had translated countless dead languages throughout her career, but the text before her now defied conventional understanding. The symbols seemed to shift under her gaze, rearranging themselves when she wasn't looking directly at them. Three months since the manuscript had arrived in an unmarked package, and still she found herself working deep into the night, drawn to its mysteries like a moth to flame."
    },
    {
      id: 3,
      title: "The Cartographer's Riddle",
      cover: "/textures/book-cover-3.jpg",
      description: "A rare map collector inherits a peculiar atlas that contains impossible geographies and pathways to places that shouldn't exist.",
      price: "$26.99",
      releaseDate: "March 8, 2025",
      pages: 356,
      excerpt: "The atlas was unlike anything Thomas had ever seen in his twenty years of map collecting. Each page contained not just the expected cartographic details, but margins filled with cryptic annotations and tiny illustrations that seemed to move when viewed from certain angles. When he traced the route marked in crimson ink, he felt a chill as his finger crossed over places that no explorer had ever documented."
    }
  ];
  
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setTimeout(() => setOpenBook(true), 300);
  };
  
  const handleClose = () => {
    setOpenBook(false);
    setTimeout(() => setSelectedBook(null), 500);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {books.map((book, idx) => (
            <div 
              key={book.id} 
              className="flex flex-col book-page overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
              onClick={() => handleBookClick(book)}
            >
              <div className="aspect-[2/3] relative overflow-hidden mb-4 flex items-center justify-center">
                {idx === 0 && (
                  <iframe
                    src="/3dbook.html?cover=cover.jpg&title=The%20Secret%20Library&color=2dd4bf&txtcolor=ffffff"
                    title="3D Book Card The Secret Library"
                    width="100%"
                    height="420"
                    className="w-full h-[420px]"
                    style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                    allowFullScreen
                  />
                )}
                {idx === 1 && (
                  <iframe
                    src="/3dbook.html?cover=cr7.jpg&title=Ronaldo&color=1abc9c&txtcolor=ffffff"
                    title="3D Book Card Ronaldo"
                    width="100%"
                    height="420"
                    className="w-full h-[420px]"
                    style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                    allowFullScreen
                  />
                )}
                {idx === 2 && (
                  <iframe
                    src="/3dbook.html?cover=messi.jpg&title=Messi&color=f1c40f&txtcolor=000000"
                    title="3D Book Card Messi"
                    width="100%"
                    height="420"
                    className="w-full h-[420px]"
                    style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                    allowFullScreen
                  />
                )}
                {idx > 2 && (
                  <iframe
                    src={`/3dbook.html?cover=${encodeURIComponent(book.cover.replace(/^\//, ''))}&title=${encodeURIComponent(book.title)}&color=2dd4bf&txtcolor=ffffff`}
                    title={`3D Book Card ${book.title}`}
                    width="100%"
                    height="420"
                    className="w-full h-[420px]"
                    style={{ border: 'none', background: 'transparent', pointerEvents: 'auto' }}
                    allowFullScreen
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent flex items-end p-4">
                  <h2 className="text-gold text-xl font-cormorant font-semibold">{book.title}</h2>
                </div>
              </div>
              <p className="text-ivory/80 line-clamp-3 mb-4 text-sm flex-grow">{book.description}</p>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-gold font-cormorant">{book.price}</span>
                <button 
                  className="text-antique hover:text-gold text-sm uppercase tracking-wider font-cormorant transition-colors duration-300"
                >
                  Explore &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
        
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
                      <p className="text-ivory">{selectedBook.price}</p>
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
