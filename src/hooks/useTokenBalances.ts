import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

interface TokenBalance {
  symbol: string;
  balance: string;
}

export const useTokenBalances = (provider: ethers.Provider, userAddress: string, tokens: string[]) => {
  const [balances, setBalances] = useState<Record<string, TokenBalance>>({});

  useEffect(() => {
    const fetchBalances = async () => {
      const balancesData: Record<string, TokenBalance> = {};

      const balancePromises = tokens.map(async (token) => {
        if (token === 'ETH') {
          try {
            const balance = await provider.getBalance(userAddress);
            balancesData['ETH'] = {
              symbol: 'ETH',
              balance: ethers.formatEther(balance)
            };
          } catch (error) {
            console.error(`Error fetching ETH balance:`, error);
            balancesData['ETH'] = {
              symbol: 'ETH',
              balance: '0'
            };
          }
        } else {
          // Предполагаем, что token это адрес токена
          const contract = new ethers.Contract(token, ERC20_ABI, provider);
          try {
            const [balance, symbol, decimals]: [ethers.BigNumberish, string, number] = await Promise.all([
              contract.balanceOf(userAddress),
              contract.symbol(),
              contract.decimals()
            ]);
            balancesData[token] = {
              symbol,
              balance: ethers.formatUnits(balance, decimals)
            };
          } catch (error) {
            console.error(`Error fetching balance for token ${token}:`, error);
            balancesData[token] = {
              symbol: 'UNKNOWN',
              balance: '0'
            };
          }
        }
      });

      await Promise.all(balancePromises);

      setBalances(balancesData);
    };

    if (provider && userAddress && tokens.length > 0) {
      fetchBalances();
    }
  }, [provider, userAddress, tokens]);

  return balances;
};
