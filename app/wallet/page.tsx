'use client'
import React, { useContext } from 'react'
import WalletConnect from '@/components/walletconnect'
import { WalletConnectContext } from '@/contexts/WalletConnectContext';
import { WalletContextInterface } from '@/types/wallets';

const WalletTestPage = () => {

      const { connectedAddress, getConnectedAddress } = useContext(
        WalletConnectContext
      ) as WalletContextInterface;
  return (
    <div>
        <h1>Hello</h1>
        <WalletConnect />
    </div>
  )
}

export default WalletTestPage