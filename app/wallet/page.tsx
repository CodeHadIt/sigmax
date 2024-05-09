'use client'
import React, { useContext } from 'react'
import WalletConnect from '@/components/walletconnect'
import { WalletConnectContext } from '@/contexts/WalletConnectContext';
import { WalletContextInterface } from '@/types/wallets';
import RuneCollectionPlaceholder from '@/components/placeholder';

const WalletTestPage = () => {

      const { connectedAddress, getConnectedAddress } = useContext(
        WalletConnectContext
      ) as WalletContextInterface;
  return (
    <section className="flex flex-col items-center justify-center">
      <h1>Hello</h1>
      <RuneCollectionPlaceholder />
      <WalletConnect />
    </section>
  );
}

export default WalletTestPage