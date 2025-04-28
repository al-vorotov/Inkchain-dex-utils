import React, { createContext, useState, ReactNode, useContext } from 'react';
import Modal from '../Components/Modal/Modal';
import WalletOptions from '../Components/WalletOptions/WalletOptions';

interface WalletContextProps {
  openWalletOptions: () => void;
  closeWalletOptions: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isWalletOptionsOpen, setIsWalletOptionsOpen] = useState(false);

  const openWalletOptions = () => setIsWalletOptionsOpen(true);
  const closeWalletOptions = () => setIsWalletOptionsOpen(false);

  return (
    <WalletContext.Provider value={{ openWalletOptions, closeWalletOptions }}>
      {children}
      {isWalletOptionsOpen && (
        <Modal title="Select Wallet" onClose={closeWalletOptions}>
          <WalletOptions />
        </Modal>
      )}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
