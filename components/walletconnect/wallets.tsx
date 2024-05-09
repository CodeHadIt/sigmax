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
      className="border flex items-center gap-10 shadow-[0px_1px_1px_rgba(0,1,2,0.2)] cursor-pointer rounded-xl p-3 transition duration-300 ease-in hover:border-red-600"
      onClick={() => getConnectedAddress(wallet.name)}
      key={index}
    >
      <Image
        src={wallet.src}
        width={50}
        height={50}
        alt={wallet.alt}
        className=""
      />
      <h4 className="">
        <span className="capitalize">{wallet.name}</span> Wallet
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
