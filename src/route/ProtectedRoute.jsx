import { useEffect, useState, useCallback, useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ requiredRole }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkAuthorization = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = await jwtDecode(token); // Use async/await for potential network requests
        const isAuthorizedRole = decoded.role === requiredRole;

        if (isAuthorizedRole) {
          setIsAuthorized(true);
        } else {
          localStorage.removeItem('token');
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [requiredRole]); // Only re-run when requiredRole changes

  useEffect(() => {
    checkAuthorization();
  }, [checkAuthorization]); // Run checkAuthorization only once after component mounts

  const isAuthorizedMemo = useMemo(() => isAuthorized, [isAuthorized]); // Memoize isAuthorized for performance optimization

  // Consider using a loading component or spinner here
  if (isLoading) {
    return <div>Loading...</div>; // Or a custom loading component
  }

  if (isAuthorizedMemo) {
    return <Outlet />;
  } else {
    return <Navigate to={`/login`} replace />;
  }
};

export default ProtectedRoute;
