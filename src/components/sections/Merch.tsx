// src/components/sections/Merch.tsx
'use client';
import { merchItems } from '@/data/merch';
import { useModal } from '@/context/ModalContext';
import SectionHeader from '@/components/ui/SectionHeader';

const Merch = () => {
  const { openModal } = useModal();
  
  const handleMerchClick = (item) => {
    openModal(item.title, (
      <div className="space-y-6">
        <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
          {item.image ? (
            <img 
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400">Merch Image Placeholder</span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-medium">{item.title}</h3>
          <p className="text-lg font-medium">{item.price}</p>
        </div>
        
        <p className="text-gray-700">{item.description}</p>
        
        {item.options && item.options.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Options</h4>
            <div className="flex flex-wrap gap-2">
              {item.options.map((option, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center pt-4">
          <a 
            href={item.storeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </div>
    ));
  };
  
  return (
    <section id="merch" className="py-20">
      <div className="container mx-auto px-6">
        <SectionHeader 
          title="Merch" 
          subtitle="Official merchandise from Favorite Library and our artists."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {merchItems.map((item) => (
            <div key={item.id} className="group cursor-pointer" onClick={() => handleMerchClick(item)}>
              <div className="aspect-square overflow-hidden rounded-lg bg-white/10 backdrop-blur-[2px] shadow-lg">
                {item.image ? (
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-100">
                    <span className="text-surface-400">No Image</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 px-1">
                <h3 className="font-medium text-base truncate">{item.title}</h3>
                <p className="text-sm text-surface-600">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Merch;