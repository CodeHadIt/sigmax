"use client";
import React, { useContext } from "react";
import Link from 'next/link';
import Image from "next/image";
import badge from "/public/images/avatars/Verified Badge.png";
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";
import AddressToggle from "./addresstoggle";

const Header = () => {

  const { connectedAddress, runeData, inscriptionData } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  return (
    <div className="space-y-10">
      <div className="flex justify-between">
        <h3 className="text-xl">
          <Link href="/"> Collections </Link>/{" "}
          {inscriptionData[0]?.collection_name}
        </h3>
        {connectedAddress ? (
          <AddressToggle />
        ) : (
          <p className="lowercase text-xl">{`<bc1pp...10kxc>`}</p>
        )}
      </div>

      <div className="white-border text-xl p-8 flex justify-between items-center bg-[#111111] min-w-[1020px]">
        <div className="flex gap-6 justify-between items-center">
          <Image
            className="rounded-full"
            src={inscriptionData[0]?.metadata.collection_page_img_url}
            width={64}
            height={64}
            alt={inscriptionData[0]?.inscription_name}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#D9D9D9]">
                {inscriptionData[0]?.collection_name}
              </span>
              <Image
                src={badge}
                width={10}
                height={10}
                alt="verification_badge"
              />
            </div>
            <span className="text-[#D9D9D9]">
              {inscriptionData.length} Items
            </span>
          </div>
        </div>

        <div>
          <span className="text-[#D9D9D9]">{runeData?.spaced_rune_name}</span>
          <div className="space-x-2">
            <span className="text-[#D9D9D9]">{runeData?.total_balance}</span>
            <span>Σ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
