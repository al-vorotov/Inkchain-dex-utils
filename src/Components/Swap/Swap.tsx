import React, { useState } from 'react';
import './Swap.css';

const tokenOptions = [
  { symbol: 'ZRX', name: '0x' },
  { symbol: 'XRP', name: 'Ripple' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'DAI', name: 'Dai' },
];

const Swap: React.FC = () => {
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [tokenFrom, setTokenFrom] = useState('ZRX');
  const [tokenTo, setTokenTo] = useState('XRP');

  const handleSwap = () => {
    console.log(`Swapping ${amountFrom} ${tokenFrom} to ${tokenTo}`);
  };

  const switchTokens = () => {
    setTokenFrom(tokenTo);
    setTokenTo(tokenFrom);
  };

  return (
    <div className="swap-container">
      <h2 className="swap-title">Swap anytime, anywhere.</h2>
      <div className="swap-box">
        <div className="swap-row">
          <input
            type="text"
            value={amountFrom}
            onChange={(e) => setAmountFrom(e.target.value)}
            placeholder="0.00"
            className="swap-input"
          />
          <span className="swap-token">
            <select value={tokenFrom} onChange={(e) => setTokenFrom(e.target.value)}>
              {tokenOptions.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </span>
        </div>

        <button className="swap-switch" onClick={switchTokens}>
          ⇅
        </button>

        <div className="swap-row">
          <input
            type="text"
            value={amountTo}
            onChange={(e) => setAmountTo(e.target.value)}
            placeholder="0.00"
            className="swap-input"
            readOnly
          />
          <span className="swap-token">
            <select value={tokenTo} onChange={(e) => setTokenTo(e.target.value)}>
              {tokenOptions.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </span>
        </div>

        <button className="swap-button" onClick={handleSwap}>Swap</button>
      </div>
    </div>
  );
};

export default Swap;
