import { Router, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import router from './routes/index.jsx';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#2563EB',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;