import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

function App() {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case rounded-lg',
          socialButtonsBlockButton: 'text-sm normal-case rounded-lg',
          formFieldInput: 'rounded-lg',
          card: 'shadow-none rounded-xl',
          headerTitle: 'text-xl font-bold',
          headerSubtitle: 'text-gray-600',
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-grow">
              <AppRoutes />
            </main>
            <Footer />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                  borderRadius: '12px',
                }
              }}
            />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;