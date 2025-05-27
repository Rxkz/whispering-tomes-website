
import { useState } from 'react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const artworks = [
    {
      id: 1, 
      title: "The Ancient Library",
      src: "/textures/gallery-1.jpg",
      description: "A digital illustration inspired by the Alexandria Library, featuring intricate architectural details and hidden symbols.",
      category: "illustrations"
    },
    {
      id: 2, 
      title: "Manuscript Detail",
      src: "/textures/gallery-2.jpg",
      description: "A close study of medieval manuscript illumination techniques, with gold leaf and natural pigments.",
      category: "manuscripts"
    },
    {
      id: 3, 
      title: "Character Study - The Librarian",
      src: "/textures/gallery-3.jpg",
      description: "Conceptual character design for Helena, the protagonist of 'The Secret Library'.",
      category: "characters"
    },
    {
      id: 4, 
      title: "Map of Forgotten Realms",
      src: "/textures/gallery-4.jpg",
      description: "Hand-drawn map featuring locations from across the book series, with tea-stained parchment effect.",
      category: "maps"
    },
    {
      id: 5, 
      title: "Botanical Studies",
      src: "/textures/gallery-5.jpg",
      description: "Detailed illustrations of the mysterious plants described in 'Whispers of the Ancients'.",
      category: "illustrations"
    },
    {
      id: 6, 
      title: "Ancient Symbols",
      src: "/textures/gallery-6.jpg",
      description: "Collection of symbols and their meanings from the fictional ancient society depicted in the books.",
      category: "manuscripts"
    }
  ];
  
  const categories = [
    { id: 'all', name: 'All Artwork' },
    { id: 'illustrations', name: 'Illustrations' },
    { id: 'manuscripts', name: 'Manuscripts' },
    { id: 'characters', name: 'Character Studies' },
    { id: 'maps', name: 'Maps' }
  ];
  
  const filteredArtworks = activeCategory === 'all' 
    ? artworks 
    : artworks.filter(art => art.category === activeCategory);
    
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-gold text-center mb-16">
          <span className="relative inline-block">
            Artwork Gallery
            <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gold/30"></span>
          </span>
        </h1>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-6 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 font-cormorant uppercase tracking-wider text-sm transition-colors duration-300 ${
                activeCategory === category.id 
                  ? 'text-gold border-b border-gold' 
                  : 'text-antique/70 hover:text-gold'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredArtworks.map(artwork => (
            <div 
              key={artwork.id}
              className="book-page p-4 cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
              onClick={() => setSelectedImage(artwork)}
            >
              <div className="aspect-square overflow-hidden mb-4 bg-forest/20">
                <img
                  src={artwork.src}
                  alt={artwork.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-cormorant font-semibold text-gold">{artwork.title}</h3>
              <p className="text-antique/60 text-sm mt-1">{artwork.category}</p>
            </div>
          ))}
        </div>
        
        {/* Image Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-gold hover:text-ivory z-10 bg-navy/50 rounded-full p-2"
                onClick={() => setSelectedImage(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              
              <div className="bg-navy/90 border-t border-gold/30 p-6 mt-4">
                <h3 className="text-2xl font-cormorant font-semibold text-gold mb-2">{selectedImage.title}</h3>
                <p className="text-ivory/80">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Commission Information */}
        <div className="max-w-2xl mx-auto mt-20">
          <div className="book-page p-8 text-center">
            <h2 className="text-2xl font-cormorant font-semibold text-gold mb-6">Art Commissions</h2>
            <p className="text-ivory/80 mb-6">
              I occasionally accept commissions for custom artwork related to literary themes, 
              ancient manuscripts, and botanical illustrations. If you're interested in commissioning 
              a piece for your personal collection or as a gift, please reach out using the form below.
            </p>
            <button className="gold-btn mx-auto">
              Request Commission
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
