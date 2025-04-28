import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAccount } from 'wagmi';
import './Header.css';
import routes from '../../routes';
import Account from '../Account/Account';
import { useWallet } from '../../contexts/WalletContext';

const Header: React.FC = () => {
  const { isConnected } = useAccount();
  const navItems = routes.filter(route => !route.isPrivate);

  const { openWalletOptions } = useWallet();

  return (
    <header className="header">
      <div className="container-header">
        <h1 className="logo">
          <span className="material-icons">swap_horiz</span> DEX
        </h1>
        <nav className="nav">
          <ul>
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? 'active' : undefined
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="wallet-connection">
          {isConnected ? (
            <Account />
          ) : (
            <>
              <button
                className="connect-wallet-button"
                onClick={openWalletOptions}
              >
                Connect Wallet
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
