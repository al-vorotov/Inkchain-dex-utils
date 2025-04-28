import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from './Components/Layout/Layout';
import routes from './routes';
import PrivateRoute from './routes/PrivateRoute';
import { config } from "./helpers/wagmiConfig";
import { WalletProvider } from './contexts/WalletContext';

const isAuthenticated = false;

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <Router>
            <Layout>
              <Routes>
                {routes.map((route, index) => {
                  const { path, component: Component, isPrivate } = route;
                  if (isPrivate) {
                    return (
                      <Route
                        key={index}
                        path={path}
                        element={
                          <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            component={Component}
                          />
                        }
                      />
                    );
                  } else {
                    return (
                      <Route key={index} path={path} element={<Component />} />
                    );
                  }
                })}
                <Route path="*" element={<h2>404: Page not found</h2>} />
              </Routes>
            </Layout>
          </Router>
        </WalletProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
};

export default App;
