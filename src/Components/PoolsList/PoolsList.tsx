import React from 'react';
import './PoolsList.css';

const PoolsList: React.FC = () => {
  const pools = [
    { id: 1, name: 'ETH/USDT', liquidity: '100,000 ETH', volume: '500 ETH' },
    { id: 2, name: 'WETH/USDT', liquidity: '50,000 WETH', volume: '200 WETH' },
  ];

  return (
    <div className="pools-list">
      <table>
        <thead>
        <tr>
          <th>Pool</th>
          <th>Liquidity</th>
          <th>Volume</th>
        </tr>
        </thead>
        <tbody>
        {pools.map(pool => (
          <tr key={pool.id}>
            <td>{pool.name}</td>
            <td>{pool.liquidity}</td>
            <td>{pool.volume}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default PoolsList;
