'use client';

import { WalletStandardProvider } from '@wallet-standard/react';
import WalletConnectContextProvider from '@/contexts/WalletConnectContext';

export default function providers({ children }) {
  return (
    <WalletStandardProvider>
      <WalletConnectContextProvider>{children}</WalletConnectContextProvider>
    </WalletStandardProvider>
  );
}
