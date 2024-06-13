import React, { useContext } from 'react'
import Header from './header'
import Body from './body'
import { WalletContextInterface } from '@/types/wallets';
import { WalletConnectContext } from '@/contexts/WalletConnectContext';
import { usePathname } from 'next/navigation';
import { PartnerCollections } from '@/data/collections';

const RuneCollectionPlaceholder = () => {
    const { connectedAddress } = useContext(
      WalletConnectContext
    ) as WalletContextInterface;
    const pathName = usePathname().replace("/", "");

    const currentCollection = PartnerCollections.find(
      (items: any) => items.slug === pathName
    );
    
  return (
    <div className="space-y-10 w-full">
      <Header />
      {connectedAddress ? (
        <div className="flex flex-col items-center">
          <p>No ordinals from {currentCollection.collection_name} in your address.</p>
          <p>Please try another address or wallet.</p>
        </div>
      ) : (
        <Body />
      )}
    </div>
  );
}

export default RuneCollectionPlaceholder