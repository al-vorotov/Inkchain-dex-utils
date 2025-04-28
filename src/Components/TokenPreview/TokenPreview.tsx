import React from 'react';
import './TokenPreview.css';

interface TokenPreviewProps {
  formData: {
    name: string;
    ticker: string;
    description: string;
    amount: number;
    imageUrl: string;
    decimals: number;
  };
  onConfirm: () => void;
}

const TokenPreview: React.FC<TokenPreviewProps> = ({ formData, onConfirm }) => {
  return (
    <div className="token-preview">
      <img src={formData.imageUrl} alt="Token Preview" className="token-image-preview" />
      <p><strong>Name:</strong> {formData.name}</p>
      <p><strong>Symbol:</strong> {formData.ticker}</p>
      <p><strong>Description:</strong> {formData.description}</p>
      <p><strong>Amount:</strong> {formData.amount}</p>
      <p><strong>Decimals:</strong> {formData.decimals}</p>
      <p className="mint-fee-note">A minting fee of 0.002 ETH will be applied.</p>
      <button onClick={onConfirm} className="confirm-mint-button">
        Confirm Mint
      </button>
    </div>
  );
};

export default TokenPreview;
