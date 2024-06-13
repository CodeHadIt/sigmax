

import React, { useContext } from 'react'
import Image from "next/image";

import avatar from "/public/images/avatars/osx-logo.gif"
import badge from "/public/images/avatars/osx-logo.gif"
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";
import AddressToggle from "./../collection/addresstoggle";

const Header = () => {
  const { connectedAddress} = useContext(
    WalletConnectContext
  ) as WalletContextInterface;


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

      <div
        className="white-border p-8 flex justify-between items-center bg-[#111111]"
      >
        <div className="flex gap-6 justify-between items-center">
          <Image
            className=""
            src={avatar}
            width={50}
            height={50}
            alt="avatar"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white">Ordinal SigmaX</span>
              <Image
                src={badge}
                width={10}
                height={10}
                alt="verification_badge"
              />
            </div>
            <span className="text-white">0 Items</span>
          </div>
        </div>

        <div>
          <span className="text-white">The.Sigma.Stone</span>
          <div className="space-x-2">
            <span className="text-white">0</span>
            <span>Σ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header