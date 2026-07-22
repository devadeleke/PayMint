import { Navigate } from 'react-router';

import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if(!isAuthenticated || !user.isVerified) {
    return <Navigate to='/signup' replace />
  }

  return children
}

export default ProtectedRoute