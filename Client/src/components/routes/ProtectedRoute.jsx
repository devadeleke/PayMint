import { Navigate } from 'react-router';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  // Wait until authentication check is complete
  if (isCheckingAuth) {
    return null;
  }

  // User must exist and be authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/signup" replace />;
  }

  // User must have verified email
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default ProtectedRoute;