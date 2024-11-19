import { useQuery, useMutation, useQueryClient } from 'react-query';
import { carsApi, Car } from '../api/cars';
import { toast } from 'react-hot-toast';

export function useCars() {
  const queryClient = useQueryClient();

  const { data: cars = [], isLoading } = useQuery('cars', () =>
    carsApi.list().then(res => res.data)
  );

  const createMutation = useMutation(carsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('cars');
      toast.success('Car listed successfully!');
    },
    onError: () => {
      toast.error('Failed to create listing');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Car> }) =>
      carsApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cars');
        toast.success('Car updated successfully!');
      },
      onError: () => {
        toast.error('Failed to update car');
      },
    }
  );

  const deleteMutation = useMutation(carsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('cars');
      toast.success('Car deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete car');
    },
  });

  return {
    cars,
    isLoading,
    createCar: createMutation.mutate,
    updateCar: updateMutation.mutate,
    deleteCar: deleteMutation.mutate,
  };
}