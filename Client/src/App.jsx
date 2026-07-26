import { useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react'

import { useAuthStore } from './store/authStore';

//PROTECT ROUTE
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';

// AUTH
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// PAGES
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/clients/ClientsPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import SettingsPage from './pages/settings/SettingsPage';

const App = () => {
  // const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  // const checkAuth = useAuthStore((state) => state.checkAuth);

  // useEffect(() => {
  //   checkAuth()
  // }, []);

  // if(isCheckingAuth) return (
  //   <div className='w-full h-screen flex items-center justify-center'>
  //     <Loader size={24} className='animate-spin' />
  //   </div>
  // )

  return (
    <>
      <Routes>

        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

        <Route path='/signup' element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } 
      />
        <Route path='/verify-email' element={
          <PublicRoute>
            <VerifyEmail />
          </PublicRoute>
        } 
      />
        <Route path='/forgot-password' element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } 
      />
        <Route path='/reset-password' element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } 
      />

        <Route path='/' element={
          // <ProtectedRoute>
            <MainLayout />
          // </ProtectedRoute>
        } 
      >
          <Route index element={<DashboardPage />} />
          <Route path='clients' element={<ClientsPage />} />
          <Route path='invoices' element={<InvoicesPage />} />
          <Route path='settings' element={<SettingsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App