import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import CarList from '../pages/CarList';
import CarCreate from '../pages/CarCreate';
import CarDetail from '../pages/CarDetail';
import CarEdit from '../pages/CarEdit';
import DemoLogin from '../components/DemoLogin';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<DemoLogin />} />
      <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
      
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/cars" element={<ProtectedRoute><CarList /></ProtectedRoute>} />
      <Route path="/cars/new" element={<ProtectedRoute><CarCreate /></ProtectedRoute>} />
      <Route path="/cars/:id" element={<ProtectedRoute><CarDetail /></ProtectedRoute>} />
      <Route path="/cars/:id/edit" element={<ProtectedRoute><CarEdit /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}