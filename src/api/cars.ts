import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL;

export interface Car {
  id: string;
  title: string;
  description: string;
  images: string[];
  carType: string;
  company: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Demo data for the demo account
const demoCars: Car[] = [
  {
    id: 'demo-1',
    title: '2023 Tesla Model S',
    description: 'Luxury electric sedan with advanced autopilot features and long range battery.',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200',
    ],
    carType: 'Electric',
    company: 'Tesla',
    tags: ['electric', 'luxury', 'autopilot'],
    userId: 'demo-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: '2023 Porsche 911 GT3',
    description: 'High-performance sports car with precision handling and racing heritage.',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
    ],
    carType: 'Sports',
    company: 'Porsche',
    tags: ['sports', 'performance', 'luxury'],
    userId: 'demo-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const isDemo = () => localStorage.getItem('demoUser') !== null;

// Create axios instance with auth header
const createAxiosInstance = async () => {
  const { getToken } = useAuth();

  const instance = axios.create({
    baseURL: API_URL,
  });

  instance.interceptors.request.use(async (config) => {
    if (isDemo()) {
      config.headers.Authorization = 'Bearer demo-token';
    } else {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  return instance;
};

// API wrapper with demo mode support
export const carsApi = {
  list: async () => {
    if (isDemo()) {
      return Promise.resolve({ data: demoCars });
    }
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.get<Car[]>('/cars');
  },

  get: async (id: string) => {
    if (isDemo()) {
      const car = demoCars.find(c => c.id === id);
      return Promise.resolve({ data: car });
    }
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.get<Car>(`/cars/${id}`);
  },

  create: async (data: Omit<Car, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (isDemo()) {
      const newCar: Car = {
        id: `demo-${demoCars.length + 1}`,
        ...data,
        userId: 'demo-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoCars.push(newCar);
      return Promise.resolve({ data: newCar });
    }
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.post<Car>('/cars', data);
  },

  update: async (id: string, data: Partial<Car>) => {
    if (isDemo()) {
      const index = demoCars.findIndex(c => c.id === id);
      if (index !== -1) {
        demoCars[index] = {
          ...demoCars[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return Promise.resolve({ data: demoCars[index] });
      }
    }
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.put<Car>(`/cars/${id}`, data);
  },

  delete: async (id: string) => {
    if (isDemo()) {
      const index = demoCars.findIndex(c => c.id === id);
      if (index !== -1) {
        demoCars.splice(index, 1);
      }
      return Promise.resolve({ data: { message: 'Car deleted successfully' } });
    }
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.delete(`/cars/${id}`);
  },

  search: async (query: string) => {
    if (isDemo()) {
      const filtered = demoCars.filter(car => {
        const searchStr = `${car.title} ${car.description} ${car.tags.join(' ')}`.toLowerCase();
        return searchStr.includes(query.toLowerCase());
      });
      return Promise.resolve({ data: filtered });
    }
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.get<Car[]>('/cars/search', { params: { q: query } });
  },
};