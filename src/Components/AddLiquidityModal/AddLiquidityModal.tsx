import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import ImportTokenModal from '../ImportTokenModal/ImportTokenModal';
import './AddLiquidityModal.css';
import { getWhitelist } from '../../constants/whitelist';
import { useTokenBalances } from '../../hooks/useTokenBalances';
import { useAccount, useProvider } from 'wagmi';

const AddLiquidityModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [whitelist, setWhitelist] = useState<string[]>(getWhitelist());
  const [tokenLeft, setTokenLeft] = useState<string>('ETH');
  const [tokenRight, setTokenRight] = useState<string>('USDT');
  const [amount, setAmount] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [selectedTokenSide, setSelectedTokenSide] = useState<'left' | 'right' | null>(null);

  const provider = useProvider();
  const { address } = useAccount();

  const balances = useTokenBalances(provider, address || '', whitelist);

  useEffect(() => {
    const handleStorageChange = () => {
      setWhitelist(getWhitelist());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleTokenChange = (side: 'left' | 'right', value: string) => {
    if (!whitelist.includes(value)) {
      setSelectedTokenSide(side);
      setIsImportModalOpen(true);
    } else {
      if (side === 'left') {
        setTokenLeft(value);
      } else {
        setTokenRight(value);
      }
    }
  };

  const handleImportSuccess = (token: string) => {
    setWhitelist(getWhitelist());
    if (selectedTokenSide === 'left') {
      setTokenLeft(token);
    } else if (selectedTokenSide === 'right') {
      setTokenRight(token);
    }
    setIsImportModalOpen(false);
    setSelectedTokenSide(null);
  };

  const getBalance = (token: string): string => {
    if (token === 'ETH') {
      return balances['ETH']?.balance || '0';
    }
    return balances[token]?.balance || '0';
  };

  return (
    <>
      <Modal title="Deposit Liquidity" onClose={onClose}>
        <div className="add-liquidity-content">
          <div className="token-selection">
            <div className="token-input">
              <label>Left</label>
              <select
                value={tokenLeft}
                onChange={(e) => handleTokenChange('left', e.target.value)}
              >
                {whitelist.map((token) => (
                  <option key={token} value={token}>
                    {token === 'ETH' ? 'ETH' : token === 'USDT' || token === 'WETH' ? token : 'TOKEN'}
                  </option>
                ))}
              </select>
            </div>
            <div className="balance">Balance: {getBalance(tokenLeft)}</div>
          </div>

          <div className="separator">+</div>

          <div className="token-selection">
            <div className="token-input">
              <label>Right</label>
              <select
                value={tokenRight}
                onChange={(e) => handleTokenChange('right', e.target.value)}
              >
                {whitelist.map((token) => (
                  <option key={token} value={token}>
                    {token === 'ETH' ? 'ETH' : token === 'USDT' || token === 'WETH' ? token : 'TOKEN'}
                  </option>
                ))}
              </select>
            </div>
            <div className="balance">Balance: {getBalance(tokenRight)}</div>
          </div>

          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="amount-input"
          />

          <button className="submit-button">Enter Amount</button>
        </div>
      </Modal>

      {isImportModalOpen && selectedTokenSide && (
        <ImportTokenModal
          onClose={() => {
            setIsImportModalOpen(false);
            setSelectedTokenSide(null);
          }}
          onImportSuccess={handleImportSuccess}
        />
      )}
    </>
  );
};

export default AddLiquidityModal;
