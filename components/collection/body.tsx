'use client'
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";
import { useContext } from 'react';
import RuneDailog from "./runedailog";

const Body = () => {
    const { connectedAddress, runeData, inscriptionData } = useContext(
      WalletConnectContext
    ) as WalletContextInterface;
  return (
    <div className="space-y-7">
      <span>Select An Item to Stake Your runes With.</span>
      <div className="flex flex-wrap gap-4">
        {inscriptionData.map((data: any, index: any) => (
          <RuneDailog key={index} inscriptionData={data} />
        ))}
      </div>
    </div>
  );
}

export default Body