'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
// Remove motion import as we'll use CSS transitions instead
import CardDetail from './CardDetail';

interface BaseCardProps {
  title: string;
  image: string;
  imageAlt?: string;
  onClick?: () => void;
  aspectRatio?: 'square' | 'video' | 'portrait';
  detailContent?: React.ReactNode;
}

const BaseCard: React.FC<BaseCardProps> = ({
  title,
  image,
  imageAlt,
  onClick,
  aspectRatio = 'square',
  detailContent,
}) => {
  const [showDetail, setShowDetail] = useState(false);
  
  // Define aspect ratio classes
  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (detailContent) {
      setShowDetail(true);
    }
  };
  
  return (
    <>
      <Card 
        className="overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
        onClick={handleCardClick}
      >
        <div className={`${aspectRatioClass} relative overflow-hidden bg-gray-100`}>
          <img
            src={image}
            alt={imageAlt || title}
            className="object-cover w-full h-full"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-base truncate">{title}</h3>
        </CardContent>
      </Card>
      
      {detailContent && (
        <CardDetail
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          title={title}
        >
          {detailContent}
        </CardDetail>
      )}
    </>
  );
};

export default BaseCard;