import React from 'react';
import { useConnect } from 'wagmi';
import './WalletOptions.css';

const WalletOptions: React.FC = () => {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={!connector.ready || isLoading}
          className="wallet-option-button"
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
        </button>
      ))}

      {error && <div className="error-message">{error.message}</div>}
    </div>
  );
};

export default WalletOptions;
