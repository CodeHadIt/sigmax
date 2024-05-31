'use client'
import React, { useContext } from "react";
import Link from 'next/link';
import Image from "next/image";
import badge from "/public/images/avatars/Verified Badge.png";
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";
import AddressToggle from "./addresstoggle";
import Logo from "/public/images/logo.png"
import { PartnerCollections } from "@/data/collections";
import { usePathname } from "next/navigation";

const Header = () => {

  const { connectedAddress, runeData, inscriptionData } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;


  //Add more properties to the partner collections and we do away with the need for accessing the first item in the array.
  //Although, it is perfectly fine since the collections will all be the very same.
  
  const pathName = usePathname().replace("/", "");
  const collectionDetails = PartnerCollections.find((collection: any) => collection.slug === pathName)
  

  return (
    <div className="space-y-10 ">
      <div className="flex grid grid-cols-3">
        <div className="flex justify-start">
          <h3 className="text-base">
            Collections / {inscriptionData[0]?.collection.name}
          </h3>
        </div>
        <div className="flex justify-center">
          <Link href="/" className="cursor-pointer">
            <Image src={Logo} width={144} height={31} alt="Runestake Logo" />
          </Link>
        </div>
        <div className="flex justify-end">
          {connectedAddress ? (
            <AddressToggle />
          ) : (
            <p className="lowercase text-base">{`<bc1pp...10kxc>`}</p>
          )}
        </div>
      </div>

      <div className="blue-border text-base p-8 flex justify-between items-center bg-[#111111] min-w-[1020px]">
        <div className="flex gap-6 justify-between items-center">
          <Image
            className="rounded-full"
            src={inscriptionData[0]?.collection.imageURI}
            width={64}
            height={64}
            alt={inscriptionData[0]?.meta.name}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#FFE297]">
                {inscriptionData[0]?.collection.name}
              </span>
              <Image
                src={badge}
                width={10}
                height={10}
                alt="verification_badge"
              />
            </div>
            <span className="text-[#FFE297]">
              {inscriptionData.length} Items
            </span>
          </div>
        </div>

        <div>
          {runeData ? (
            <>
              <span className="text-[#FFE297]">{runeData?.spacedRune}</span>
              <div className="space-x-2 flex justify-end">
                <span className="text-[#FFE297] ">{runeData?.amount}</span>
                <span>{runeData?.symbol}</span>
                {/* <span>Σ</span> */}
              </div>
            </>
          ) : (
            <>
              <span className="text-[#FFE297]">N/A</span>
              <div className="space-x-2 flex justify-end">
                <span className="text-[#FFE297] ">0</span>
                <span>N/A</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
