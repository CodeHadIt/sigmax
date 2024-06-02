import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";
import { useContext } from "react";
import dynamic from "next/dynamic";
import stakedIcon from "@/public/images/svg/stake-icon.svg";
import Image from "next/image";

// import RuneDailog from "";
const RuneDailog = dynamic(() => import("./runedailog"), {
  loading: () => <p>Loading...</p>,
});

const Body = () => {
  const { inscriptionData, runeData } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  return (
    <div className="space-y-7 text-base">
      <span>Select An Item to Stake Your runes With.</span>
      <div className="grid grid-cols-7 gap-4">
        {inscriptionData?.map((data: any, index: any) => {
          const hasUtxo = runeData?.utxos.find((utxo: any) => utxo.location === data.output)
          return hasUtxo ? (
            <div className="relative">
              <RuneDailog key={index} inscriptionData={data} />
              <Image src={stakedIcon} alt="staking_icon" className="absolute top-3 right-3" />
            </div>
          ) : (
            <>
              <RuneDailog key={index} inscriptionData={data} />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Body;
