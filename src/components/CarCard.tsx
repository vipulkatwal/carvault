import { Link } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';

interface CarCardProps {
  id: string;
  title: string;
  description: string;
  images: string[];
  carType: string;
  company: string;
  tags: string[];
  onDelete: (id: string) => void;
}

export default function CarCard({ 
  id, 
  title, 
  description, 
  images, 
  carType,
  company,
  tags, 
  onDelete 
}: CarCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      <Link to={`/cars/${id}`}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={images[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80'}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-semibold text-white line-clamp-1 mb-1">{title}</h3>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium bg-blue-500/80 text-white rounded-full">
                {company}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-green-500/80 text-white rounded-full">
                {carType}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/cars/${id}/edit`}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="h-5 w-5" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(id);
            }}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}