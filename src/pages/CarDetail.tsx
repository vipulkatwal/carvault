import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { ChevronLeft, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { carsApi } from '../api/cars';

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: car, isLoading } = useQuery(['car', id], () => 
    carsApi.get(id!).then(res => res.data)
  );

  const deleteMutation = useMutation(() => carsApi.delete(id!), {
    onSuccess: () => {
      toast.success('Car deleted successfully');
      navigate('/cars');
    },
    onError: () => {
      toast.error('Failed to delete car');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Car not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Cars
        </button>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/cars/${id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this car?')) {
                deleteMutation.mutate();
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative aspect-video">
          <img
            src={car.images[0]}
            alt={car.title}
            className="w-full h-full object-cover"
          />
        </div>

        {car.images.length > 1 && (
          <div className="p-4 border-t border-gray-200 overflow-x-auto">
            <div className="flex space-x-4">
              {car.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${car.title} - ${index + 2}`}
                  className="h-24 w-36 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{car.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {car.company}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {car.carType}
            </span>
            {car.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-600 whitespace-pre-line">{car.description}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <p>Listed on {new Date(car.createdAt).toLocaleDateString()}</p>
              <p>Last updated {new Date(car.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}