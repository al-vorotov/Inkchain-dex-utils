# Decentralized Exchange (DEX) on Inchain

A React-based dApp for seamless token swaps, minting, and profile management on Inchain.

## Features
- **Liquidity Provision**: Add/remove liquidity to pools and earn fees.
- **Token Minting**: Create and deploy custom tokens (ERC-20 style) in a few clicks.
- **User Profile**: View balances, transaction history, and connected wallet stats.
- **DEX Swaps**: Trade tokens with low slippage using integrated AMM.

## Tech Stack
### Frontend
- **Framework**: React.js (TypeScript)
- **State Management**: Redux Toolkit
- **UI Components**: Radix UI / HeadlessUI

### Blockchain
- **Smart Contracts**: Solidity (Inchain-compatible)
- **Web3 Libraries**: Ethers.js, Inchain SDK
- **Wallet Integration**: MetaMask, WalletConnect, Inchain Wallet

## Key Smart Contracts
- `LiquidityPool.sol` - AMM logic
- `TokenFactory.sol` - Minting interface
- `ProfileRegistry.sol` - On-chain user data
