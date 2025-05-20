
import { useState, useEffect } from 'react';
import Hero3DBook from '../components/Hero3DBook';
import { ArrowRight } from 'lucide-react';

const Books = () => {
  const [bookOpened, setBookOpened] = useState(false);
  const [showPurchaseOptions, setShowPurchaseOptions] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'synopsis' | 'sample' | 'purchase'>('synopsis');
  
  const bookData = {
    id: 1,
    title: "The Secret Library",
    cover: "/textures/book-cover-1.jpg",
    description: "A centuries-old mystery unfolds when a librarian discovers a hidden chamber beneath an ancient university, containing texts that were thought to be lost to history.",
    price: "$24.99",
    releaseDate: "June 15, 2024",
    pages: 384,
    excerpt: "The dust scattered as Helena's fingers traced the spine of the ancient tome. Its leather binding, cracked with age, seemed to pulse beneath her touch as if awakening from a centuries-long slumber. The restricted section of the university library had always been her sanctuary, but tonight, something felt different in the air—a whisper of secrets waiting to be unveiled.",
    fullExcerpt: "The dust scattered as Helena's fingers traced the spine of the ancient tome. Its leather binding, cracked with age, seemed to pulse beneath her touch as if awakening from a centuries-long slumber. The restricted section of the university library had always been her sanctuary, but tonight, something felt different in the air—a whisper of secrets waiting to be unveiled.\n\nA faint golden glow seeped from between the pages, illuminating the worn oak shelves around her. Helena glanced over her shoulder—Professor Blackwood would hardly approve of her presence here after hours, let alone her interest in the Restricted Arcanum Collection.\n\nShe carefully lifted the book from its resting place, surprised by its unexpected lightness. The cover bore no title, only an intricate pattern of intertwined branches that seemed to shift subtly in the candlelight. As she opened to the first page, the library around her seemed to fade, the wooden shelves receding into shadows, the air growing thick with the scent of ancient paper and something else—something older, like petrichor and distant forests.\n\n'Found something interesting, Miss Thorne?'\n\nThe voice startled her so severely she nearly dropped the tome. Standing in the doorway was not Professor Blackwood as she had feared, but a figure she had never seen before—tall and elegant in an old-fashioned tweed suit, with eyes that reflected the same golden light that emanated from the book in her hands."
  };

  useEffect(() => {
    // Add a slight delay before showing purchase options after book opens
    if (bookOpened) {
      const timer = setTimeout(() => {
        setShowPurchaseOptions(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowPurchaseOptions(false);
    }
  }, [bookOpened]);

  const handleBookInteraction = () => {
    setBookOpened(!bookOpened);
  };

  const handlePurchase = () => {
    // This would connect to Stripe later
    alert("Purchase functionality will be integrated with Stripe soon!");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex flex-col">
      <div className="container mx-auto flex-grow flex flex-col">
        {/* Book Presentation Stage */}
        <div className="flex-grow flex flex-col items-center justify-center relative">
          {/* 3D Book with interaction prompt */}
          <div 
            className={`transition-all duration-1000 ease-in-out ${bookOpened ? 'scale-90 -translate-y-10' : 'hover:scale-105'}`}
            style={{ height: '500px', width: '100%', maxWidth: '800px' }}
          >
            <div 
              className="h-full cursor-pointer relative" 
              onClick={handleBookInteraction}
            >
              <Hero3DBook 
                isHovered={!bookOpened}
                isOpened={bookOpened}
                bookTitle={bookData.title}
                bookAuthor="Author Name"
                coverImage={bookData.cover}
              />
              
              {!bookOpened && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-navy/70 backdrop-blur-sm p-4 rounded border border-gold/30 text-gold animate-pulse">
                    Click to open the book
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Book Contents (appears when opened) */}
          {bookOpened && (
            <div className={`w-full max-w-4xl transition-all duration-700 ${showPurchaseOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="book-page mt-8 p-8 transform transition-all duration-500 relative overflow-hidden">
                {/* Deckled edge effect at the top */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-antique/10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'url("/textures/deckled-edge.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    opacity: 0.8
                  }}></div>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex border-b border-gold/30 mb-6">
                  <button 
                    className={`py-2 px-4 mr-2 font-cormorant uppercase tracking-widest text-sm ${selectedTab === 'synopsis' ? 'text-gold border-b-2 border-gold -mb-px' : 'text-antique hover:text-gold'}`}
                    onClick={() => setSelectedTab('synopsis')}
                  >
                    Synopsis
                  </button>
                  <button 
                    className={`py-2 px-4 mr-2 font-cormorant uppercase tracking-widest text-sm ${selectedTab === 'sample' ? 'text-gold border-b-2 border-gold -mb-px' : 'text-antique hover:text-gold'}`}
                    onClick={() => setSelectedTab('sample')}
                  >
                    Sample
                  </button>
                  <button 
                    className={`py-2 px-4 font-cormorant uppercase tracking-widest text-sm ${selectedTab === 'purchase' ? 'text-gold border-b-2 border-gold -mb-px' : 'text-antique hover:text-gold'}`}
                    onClick={() => setSelectedTab('purchase')}
                  >
                    Purchase
                  </button>
                </div>
                
                {/* Tab Content */}
                <div className="min-h-[300px]">
                  {/* Synopsis Tab */}
                  {selectedTab === 'synopsis' && (
                    <div className="space-y-6 animate-fade-in">
                      <h2 className="text-3xl font-cormorant font-bold text-gold">{bookData.title}</h2>
                      <p className="text-ivory/90 leading-relaxed">{bookData.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                          <h3 className="text-gold font-cormorant text-sm uppercase tracking-wide">Price</h3>
                          <p className="text-ivory">{bookData.price}</p>
                        </div>
                        <div>
                          <h3 className="text-gold font-cormorant text-sm uppercase tracking-wide">Release Date</h3>
                          <p className="text-ivory">{bookData.releaseDate}</p>
                        </div>
                        <div>
                          <h3 className="text-gold font-cormorant text-sm uppercase tracking-wide">Pages</h3>
                          <p className="text-ivory">{bookData.pages}</p>
                        </div>
                        <div>
                          <h3 className="text-gold font-cormorant text-sm uppercase tracking-wide">Format</h3>
                          <p className="text-ivory">Hardcover, E-book</p>
                        </div>
                      </div>
                      
                      <button 
                        className="text-gold hover:text-ivory transition-colors duration-300 flex items-center gap-2 mt-4 group"
                        onClick={() => setSelectedTab('sample')}
                      >
                        Read sample 
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  )}
                  
                  {/* Sample Chapter Tab */}
                  {selectedTab === 'sample' && (
                    <div className="animate-fade-in">
                      <h2 className="text-2xl font-cormorant font-bold text-gold mb-4">Sample Chapter</h2>
                      <div className="bg-navy/40 border border-gold/20 p-6 text-ivory/90 leading-relaxed" style={{
                        backgroundImage: 'url("/textures/paper-light.png")',
                        backgroundBlendMode: 'overlay',
                        backgroundSize: 'cover'
                      }}>
                        <p className="first-letter:text-4xl first-letter:font-serif first-letter:mr-1 first-letter:float-left first-letter:text-gold whitespace-pre-line">
                          {bookData.fullExcerpt}
                        </p>
                      </div>
                      
                      <div className="mt-8 flex justify-between">
                        <button 
                          className="text-gold hover:text-ivory transition-colors duration-300"
                          onClick={() => setSelectedTab('synopsis')}
                        >
                          &larr; Back to synopsis
                        </button>
                        <button 
                          className="text-gold hover:text-ivory transition-colors duration-300 flex items-center gap-2 group"
                          onClick={() => setSelectedTab('purchase')}
                        >
                          Continue to purchase 
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Purchase Tab */}
                  {selectedTab === 'purchase' && (
                    <div className="animate-fade-in">
                      <h2 className="text-2xl font-cormorant font-bold text-gold mb-6">Purchase Options</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-navy/30 border border-gold/30 p-6 rounded-sm hover:border-gold transition-colors duration-300">
                          <h3 className="text-xl font-cormorant font-semibold text-gold mb-2">Hardcover Edition</h3>
                          <p className="text-ivory/80 mb-4">Premium hardcover with gold foil details on cover and spine.</p>
                          <div className="flex justify-between items-end">
                            <span className="text-lg text-gold">{bookData.price}</span>
                            <button 
                              className="relative"
                              onClick={handlePurchase}
                            >
                              <img src="/textures/wax-seal.png" alt="Wax seal" className="w-16 h-16 object-contain hover:scale-110 transition-transform duration-300" />
                              <span className="absolute inset-0 flex items-center justify-center text-navy font-cormorant text-xs font-bold">BUY</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-navy/30 border border-gold/30 p-6 rounded-sm hover:border-gold transition-colors duration-300">
                          <h3 className="text-xl font-cormorant font-semibold text-gold mb-2">Digital Edition</h3>
                          <p className="text-ivory/80 mb-4">Instant access to ePub, Mobi, and PDF formats.</p>
                          <div className="flex justify-between items-end">
                            <span className="text-lg text-gold">$14.99</span>
                            <button 
                              className="relative"
                              onClick={handlePurchase}
                            >
                              <img src="/textures/wax-seal-2.png" alt="Wax seal" className="w-16 h-16 object-contain hover:scale-110 transition-transform duration-300" />
                              <span className="absolute inset-0 flex items-center justify-center text-navy font-cormorant text-xs font-bold">BUY</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 bg-forest/10 border border-gold/20 p-4 rounded-sm">
                        <h3 className="text-lg font-cormorant font-semibold text-gold mb-2">Special Offer</h3>
                        <p className="text-ivory/80 mb-2">Purchase the hardcover and get the digital edition for free.</p>
                        <button 
                          className="gold-btn mt-2 w-full"
                          onClick={handlePurchase}
                        >
                          Bundle for {bookData.price}
                        </button>
                      </div>
                      
                      <div className="mt-6">
                        <button 
                          className="text-gold hover:text-ivory transition-colors duration-300"
                          onClick={() => setSelectedTab('sample')}
                        >
                          &larr; Back to sample
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
