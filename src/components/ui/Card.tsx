// src/components/ui/Card.tsx
interface CardProps {
  title: string;
  image?: string;
  onClick: () => void;
}

const Card = ({ title, image, onClick }: CardProps) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="aspect-square bg-gray-200 flex items-center justify-center">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">Image Placeholder</span>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
    </div>
  );
};

export default Card;