import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './ImportTokenModal.css';
import { useProvider } from 'wagmi';
import { ethers } from 'ethers';
import { getImportedTokens } from '../../constants/whitelist';

interface ImportTokenModalProps {
  onClose: () => void;
  onImportSuccess: (token: string) => void;
}

const ImportTokenModal: React.FC<ImportTokenModalProps> = ({ onClose, onImportSuccess }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const provider = useProvider();

  const handleVerifyToken = async () => {
    setError(null);
    setIsVerifying(true);
    try {
      await getTokenSymbol(tokenAddress, provider);
      setIsConfirmModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Invalid token address or unable to fetch token data.');
    }
    setIsVerifying(false);
  };

  const handleImport = async () => {
    let symbol = 'Unknown';
    try {
      symbol = await getTokenSymbol(tokenAddress, provider);
    } catch {
    }

    const importedTokens = getImportedTokens();
    if (!importedTokens.includes(tokenAddress)) {
      const updatedImportedTokens = [...importedTokens, tokenAddress];
      localStorage.setItem('importedTokens', JSON.stringify(updatedImportedTokens));
    }
    onImportSuccess(tokenAddress);
    setIsConfirmModalOpen(false);
    onClose();
  };

  return (
    <>
      <Modal title="Import Token" onClose={onClose}>
        <div className="import-token-content">
          <input
            type="text"
            placeholder="Enter Token Address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="token-address-input"
          />
          {error && <div className="error-message">{error}</div>}
          <button onClick={handleVerifyToken} className="verify-button" disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify Token'}
          </button>
        </div>
      </Modal>

      {isConfirmModalOpen && (
        <Modal title="Import Confirmation" onClose={() => setIsConfirmModalOpen(false)}>
          <div className="confirm-import-content">
            <p>
              This coin isn't whitelisted. Anyone can create ERC-20 coins, including fakes of existing ones.
              Make sure you're aware of risks associated with non-whitelisted coins.
            </p>
            <button onClick={handleImport} className="import-button">
              Import
            </button>
            <button onClick={() => setIsConfirmModalOpen(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

const getTokenSymbol = async (address: string, provider: ethers.Provider): Promise<string> => {
  if (!ethers.isAddress(address)) {
    throw new Error('Invalid address');
  }

  const ERC20_ABI = [
    "function symbol() view returns (string)"
  ];

  const contract = new ethers.Contract(address, ERC20_ABI, provider);
  const symbol = await contract.symbol();
  return symbol;
};

export default ImportTokenModal;
