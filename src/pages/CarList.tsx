import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { useCars } from '../hooks/useCars';

export default function CarList() {
  const { cars, isLoading, deleteCar } = useCars();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCars = cars.filter((car) => {
    const searchStr = `${car.title} ${car.description} ${car.tags.join(' ')}`.toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.16))]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">My Cars</h1>
        <Link
          to="/cars/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Car
        </Link>
      </div>

      <div className="relative max-w-xl animate-fade-in">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="search"
          placeholder="Search by title, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {filteredCars.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
            <p className="text-gray-600 mb-4">No cars found. Try adjusting your search or add a new car.</p>
            <Link
              to="/cars/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Car
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              {...car}
              onDelete={() => {
                if (window.confirm('Are you sure you want to delete this car?')) {
                  deleteCar(car.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}