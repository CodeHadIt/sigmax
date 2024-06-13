"use client";
import React, { useContext } from "react";
import WalletConnect from "@/components/walletconnect";
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";
import RuneCollectionPlaceholder from "@/components/placeholder";
import CollectionOverview from "@/components/collection";

const WalletTestPage = () => {
  const { connectedAddress, inscriptionData, runeData } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  return (
    <section className="flex flex-col items-center justify-center">
      {inscriptionData.length && connectedAddress ? (
        <CollectionOverview />
      ) : (
        <RuneCollectionPlaceholder />
      )}
      <WalletConnect />
    </section>
  );
};

export default WalletTestPage;
