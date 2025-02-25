// src/components/sections/Merch.tsx
'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { merchItems } from '@/data/merch';

const Merch = () => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  
  return (
    <section id="merch" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-light mb-12">Merch</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {merchItems.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              image={item.image}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </div>
      
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || ''}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
              {selectedItem.image ? (
                <img 
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400">Merch Image Placeholder</span>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium">{selectedItem.title}</h3>
              <p className="text-lg font-medium">{selectedItem.price}</p>
            </div>
            
            <p className="text-gray-700">{selectedItem.description}</p>
            
            {selectedItem.options && selectedItem.options.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Options</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.options.map((option: string, index: number) => (
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
                href={selectedItem.storeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                Shop Now
              </a>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Merch;