import { http, createConfig } from 'wagmi';
import { injected, metaMask, safe } from 'wagmi/connectors';

const inkSepolia = {
  id: 763373, // Chain ID  Ink Sepolia
  name: 'Ink Sepolia',
  network: 'ink-sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-qnd-sepolia.inkonchain.com'] },
    public: { http: ['https://rpc-qnd-sepolia.inkonchain.com'] },
  },
  blockExplorers: {
    default: { name: 'Ink Sepolia Explorer', url: 'https://explorer-sepolia.inkonchain.com' },
  },
};


export const config = createConfig({
  chains: [inkSepolia],
  connectors: [
    injected(),
    metaMask(),
    safe(),
  ],
  transports: {
    [inkSepolia.id]: http('https://rpc-qnd-sepolia.inkonchain.com'),
  },
});
