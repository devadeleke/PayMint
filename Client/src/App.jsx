import { Routes, Route } from 'react-router';
import { Toaster } from "react-hot-toast"
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/resetPassword';
import Dashboard from './pages/auth/Dashboard';

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App