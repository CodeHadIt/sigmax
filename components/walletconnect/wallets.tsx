"use client";

import { useContext } from "react";
import Image from "next/image";

import { walletsDetails } from "@/data/walletsinfo";

import Unisat from "/public/images/wallets-icons/unisat_logo.png";
import Leather from "/public/images/wallets-icons/leather_logo.png";
import Xverse from "/public/images/wallets-icons/xverse_logo.png";
import Okx from "/public/images/wallets-icons/okx_logo.png";

import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";


type WalletsDetailsKeys = keyof typeof walletsDetails;

const Wallets = () => {
  const { connectedAddress, getConnectedAddress } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;


  const walletImages = walletsDetails.map((wallet, index) => (
    <div
      className="flex items-center h-[70px] bg-[#222222] mb-6 gap-4 cursor-crosshair p-3 button-hover hover:bg-[#333333]"
      onClick={() => getConnectedAddress(wallet.name)}
      key={index}
    >
      <Image
        src={wallet.src}
        width={40}
        height={40}
        alt={wallet.alt}
        className="p-1"
      />
      <h4 className="">
        <span className="uppercase text-[#D9D9D9] text-lg">{wallet.name}</span>
      </h4>
    </div>
  ));

  return (
    <div className="space-y-5 text-center">
      {walletImages}
    </div>
  );
};

export default Wallets;
