import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import MintForm, { FieldConfig } from '../../Components/MintForm/MintForm';
import WalletOptions from '../../Components/WalletOptions/WalletOptions';
import Modal from '../../Components/Modal/Modal';
import TokenPreview from '../../Components/TokenPreview/TokenPreview';
import TokenFactoryABI from '../../Contracts/MintToken/artifacts/TokenFactory.json';

import './MintPage.css';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS!;
const mintFee = parseFloat(process.env.REACT_APP_MINT_FEE || '0.002');
const defaultDecimals = parseInt(process.env.REACT_APP_DECIMALS || '18');
const explorerBaseUrl = "https://explorer-sepolia.inkonchain.com/";

const MintPage: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    description: '',
    amount: 1,
    imageUrl: '',
    decimals: defaultDecimals,
  });

  const isFormComplete = Object.values(formData).every((field) => field !== '' && field !== 0);

  const fields: FieldConfig[] = [
    { id: 'name', label: 'Token Name', type: 'text', placeholder: 'Enter the token name', required: true },
    { id: 'ticker', label: 'Ticker Symbol', type: 'text', placeholder: 'Enter the ticker symbol', required: true, maxLength: 5 },
    { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter a description for the token', required: true },
    { id: 'amount', label: 'Amount to Mint', type: 'number', placeholder: 'Enter the number of tokens', required: true, min: 1 },
    { id: 'imageUrl', label: 'Image URL', type: 'url', placeholder: 'Enter the image URL', required: true },
    { id: 'decimals', label: 'Decimals', type: 'number', placeholder: 'Enter decimals (0-18)', required: true, min: 0, max: 18, defaultValue: defaultDecimals },
  ];

  const handleMint = () => {
    if (!isConnected) {
      setShowWalletOptions(true);
    } else if (isFormComplete) {
      setShowPreview(true);
    }
  };

  const confirmMint = async () => {
    if (!address || !window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(contractAddress, TokenFactoryABI.abi, signer);

      const amountInUnits = ethers.parseUnits(formData.amount.toString(), formData.decimals);
      const feeInWei = ethers.parseEther(mintFee.toString());

      const tx = await contract.createToken(
        formData.name,
        formData.ticker,
        amountInUnits,
        formData.decimals,
        { value: feeInWei }
      );

      console.log("Mint successful:", tx);
      setTransactionHash(tx.hash);

      setShowPreview(false);

      setFormData({
        name: '',
        ticker: '',
        description: '',
        amount: 1,
        imageUrl: '',
        decimals: defaultDecimals,
      });
    } catch (error) {
      console.error("Minting error:", error);
    }
  };

  return (
    <div className="mint-page">
      <h2>Mint you ERC-20 token</h2>
      <MintForm
        fields={fields}
        formData={formData}
        setFormData={setFormData}
      />

      {showWalletOptions && (
        <Modal title="Select Wallet" onClose={() => setShowWalletOptions(false)}>
          <WalletOptions />
        </Modal>
      )}

      {showPreview && (
        <Modal title="Token Preview" onClose={() => setShowPreview(false)}>
          <TokenPreview formData={formData} onConfirm={confirmMint} />
        </Modal>
      )}

      <button
        className="mint-button"
        onClick={handleMint}
        disabled={isConnected && !isFormComplete}
      >
        {isConnected ? 'Mint Tokens' : 'Connect Wallet'}
      </button>

      {transactionHash && (
        <div className="transaction-success">
          Mint successful! <a href={`tx/${explorerBaseUrl}${transactionHash}`} target="_blank" rel="noopener noreferrer">View transaction</a>
        </div>
      )}
    </div>
  );
};

export default MintPage;
