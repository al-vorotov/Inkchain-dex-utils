export const initialWhitelist = ['ETH', 'USDT', 'WETH'];

export const getImportedTokens = (): string[] => {
  const imported = localStorage.getItem('importedTokens');
  return imported ? JSON.parse(imported) : [];
};

export const getWhitelist = (): string[] => {
  return [...initialWhitelist, ...getImportedTokens()];
};
