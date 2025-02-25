// src/components/sections/Moodboard.tsx
'use client';

// This would normally come from your data/images
const placeholderImages = Array(8).fill(null);

const Moodboard = () => {
  return (
    <section id="moodboard" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-light mb-12">Moodboard</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {placeholderImages.map((_, index) => (
            <div 
              key={index} 
              className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden"
            >
              <span className="text-gray-400">Image {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Moodboard;