import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ requiredRole }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  console.log("protected route");

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
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
  }, [requiredRole, location]);

  if (isLoading) {
    // Optionally, return a loading indicator while checking authorization
    return <div>Loading...</div>;
  }

  if (isAuthorized) {
    return <Outlet />;
  } else {
    return <Navigate to={`/login`} replace />;
  }
};

export default ProtectedRoute;