import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import SearchBar from '../../Components/SearchBar/SearchBar';
import PoolsList from '../../Components/PoolsList/PoolsList';
import AddLiquidityModal from "../../Components/AddLiquidityModal/AddLiquidityModal";

import './LiquidityPage.css';

const LiquidityPage: React.FC = () => {
  const [showAddLiquidityModal, setShowAddLiquidityModal] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect, connectors, error: connectError, isLoading: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const [error, setError] = useState<string>('');

  const handleConnectWallet = async () => {
    try {
      await connect({ connector: connectors[0] });
      setError('');
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError('Не удалось подключить кошелёк.');
    }
  };

  return (
    <div className="liquidity-page">
      <h2>Pools</h2>
      <SearchBar />
      <div className="header-pools">
        <h2>Pools (2)</h2>
        <div className="actions">
          {isConnected ? (
            <>
              <div className="user-address">
                Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
              </div>
              <button className="create-pool-button" onClick={() => setShowAddLiquidityModal(true)}>
                Create Pool
              </button>
              <button className="disconnect-button" onClick={() => disconnect()}>
                Disconnect
              </button>
            </>
          ) : (
            <button className="connect-wallet-button" onClick={handleConnectWallet} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <PoolsList />
      {showAddLiquidityModal && isConnected && address && (
        <AddLiquidityModal
          onClose={() => setShowAddLiquidityModal(false)}
        />
      )}
    </div>
  );
};

export default LiquidityPage;
