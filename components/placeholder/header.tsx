

import React, { useContext } from 'react'
import Image from "next/image";

import avatar from "/public/images/avatars/osx-logo.gif"
import badge from "/public/images/avatars/osx-logo.gif"
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";
import AddressToggle from "./../collection/addresstoggle";
import { useMediaQuery } from 'react-responsive';

const Header = () => {
  const { connectedAddress} = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  const isLargeScreens = useMediaQuery({ query: "(min-width: 768px)" });


  return (
    <div className="space-y-10">
      <div className="flex justify-between">
        <h3>Collections / Ordinal SigmaX</h3>
        {connectedAddress ? (
          <AddressToggle />
        ) : (
          <p className="lowercase text-base">{`<bc1pp...10kxc>`}</p>
        )}
      </div>

      <div className="blue-border text-sm md:text-base p-6 md:p-8 flex justify-between items-center bg-[#111111] w-full relative">
        <div className="flex gap-6 justify-between flex-col md:flex-row items-center">
          {isLargeScreens ? (
            <Image
              className="rounded-full"
              src={avatar}
              width={50}
              height={50}
              alt="avatar"
            />
          ) : (
            <Image
              className="rounded-full absolute top-[-25px] left-[20px]"
              src={avatar}
              width={45}
              height={45}
              alt="avatar"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#FFE297]">Ordinal SigmaX</span>
              <Image
                src={badge}
                width={10}
                height={10}
                alt="verification_badge"
              />
            </div>
            <span className="text-[#FFE297]">0 Items</span>
          </div>
        </div>

        <div>
          <span className="text-[#FFE297]">The.Sigma.Stone</span>
          <div className="space-x-2">
            <span className="text-[#FFE297]">0</span>
            <span>Σ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header