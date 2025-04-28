import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
                                                     component: Component,
                                                     isAuthenticated,
                                                   }) => {
  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default PrivateRoute;
