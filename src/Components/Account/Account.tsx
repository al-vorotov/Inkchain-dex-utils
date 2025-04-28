import React from 'react';
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import './Account.css'; // Create this file for styling

export const Account: React.FC = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined });

  return (
    <div className="account-info">
      {ensAvatar && <img className="ens-avatar" alt="ENS Avatar" src={ensAvatar} />}
      {address && (
        <div className="account-address">
          {ensName
            ? `${ensName} (${address.substring(0, 6)}...${address.substring(
              address.length - 4
            )})`
            : `${address.substring(0, 6)}...${address.substring(
              address.length - 4
            )}`}
        </div>
      )}
      <button className="disconnect-button" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
};

export default Account;
