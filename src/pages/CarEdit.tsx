import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import { carsApi } from '../api/cars';
import ImageUpload from '../components/ImageUpload';

const carTypes = ['Sedan', 'SUV', 'Sports', 'Luxury', 'Electric', 'Hybrid', 'Truck', 'Van'];
const companies = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Tesla', 'Porsche', 'Audi'];

export default function CarEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as string[],
    carType: '',
    company: '',
    customTags: '',
  });

  const { data: car } = useQuery(['car', id], () => 
    carsApi.get(id!).then(res => res.data)
  );

  useEffect(() => {
    if (car) {
      setFormData({
        title: car.title,
        description: car.description,
        images: car.images,
        carType: car.carType,
        company: car.company,
        customTags: car.tags.join(', '),
      });
    }
  }, [car]);

  const updateMutation = useMutation(
    (data: typeof formData) => carsApi.update(id!, {
      ...data,
      tags: data.customTags.split(',').map(tag => tag.trim()).filter(Boolean),
    }),
    {
      onSuccess: () => {
        toast.success('Car updated successfully');
        navigate(`/cars/${id}`);
      },
      onError: () => {
        toast.error('Failed to update car');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/cars/${id}`)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Car Details
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Car Listing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images
            </label>
            <ImageUpload
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="carType" className="block text-sm font-medium text-gray-700 mb-1">
                Car Type
              </label>
              <select
                id="carType"
                value={formData.carType}
                onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select type</option>
                {carTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <select
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="customTags" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Tags
            </label>
            <input
              type="text"
              id="customTags"
              value={formData.customTags}
              onChange={(e) => setFormData({ ...formData, customTags: e.target.value })}
              placeholder="Enter tags separated by commas"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/cars/${id}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}