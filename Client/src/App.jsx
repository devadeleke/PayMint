// import { useEffect } from 'react';
import { Routes, Route,  } from 'react-router';
import { Toaster } from 'react-hot-toast';
// import { Loader } from 'lucide-react'

// import { useAuthStore } from './utils/authStore';Navigate

// AUTH
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import InvoicesPage from './pages/InvoicesPage';
import SettingsPage from './pages/SettingsPage';

// const ProtectRoute = ({ children }) => {
//   const { isAuthenticated, user } = useAuthStore();

//   if(!isAuthenticated) {
//     return <Navigate to='/login' replace />
//   }

//   if(!user.isVerified) {
//     return <Navigate to='verify-email' replace />
//   }

//   return children
// }

// REDIRECT AUTHENTICATED USERS TO THE HOMEPAGE
// const RedirectAuthenticatedUser = ({ children }) => {
//   const { isAuthenticated, user} = useAuthStore();

//   if(isAuthenticated && user.isVerified) {
//     return <Navigate to='/' replace />
//   };

//   return children;
// }

const App = () => {
  // const { isCheckingAuth, checkAuth} = useAuthStore();

  // useEffect(() => {
  //   checkAuth()
  // }, [checkAuth]);

  // if(isCheckingAuth) <Loader size={24} className='mx-auto animate-spin' />

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        <Route path='/' element={<MainLayout />}>
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