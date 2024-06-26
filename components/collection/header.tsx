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
import LoadHeader from "./loadHeader";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";

const Header = () => {

  const { connectedAddress, runeData, inscriptionData } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  const isLargeScreens = useMediaQuery({ query: "(min-width: 768px)" });


  //Add more properties to the partner collections and we do away with the need for accessing the first item in the array.
  //Although, it is perfectly fine since the collections will all be the very same.

  const dataReceived = runeData && inscriptionData;
  
  const pathName = usePathname().replace("/", "");
  const collectionDetails = PartnerCollections.find((collection: any) => collection.slug === pathName)

  const runeBalance = runeData?.utxos.reduce((accumulator, utxo) => accumulator + utxo.balance, 0);

  return (
    <div className="space-y-10 flex flex-col">
      <div className="flex justify-between w-full">
        <div className="flex justify-start">
          <h3 className="text-base">
            <Link href="/">Collections</Link><span className="hidden md:inline"> /{" "}
            {collectionDetails?.collection_name}</span>
          </h3>
        </div>
        {isLargeScreens && (
          <div className="flex justify-center">
            <Link href="/" className="cursor-pointer">
              <Image src={Logo} width={144} height={31} alt="RuneStake Logo" />
            </Link>
          </div>
        )}
        <div className="flex justify-end">
          {connectedAddress ? (
            <AddressToggle />
          ) : (
            <p className="lowercase text-base">{`<bc1pp...10kxc>`}</p>
          )}
        </div>
      </div>

      {dataReceived ? (
        <div className="blue-border text-sm md:text-base p-6 md:p-8 flex justify-between items-center bg-[#111111] w-full relative">
          <div className="flex gap-6 justify-between flex-col md:flex-row items-center">
            {isLargeScreens ? (
              <Image
                className="rounded-full"
                src={inscriptionData[0]?.collection.imageURI}
                width={64}
                height={64}
                alt={inscriptionData[0]?.meta.name}
              />
            ) : (
              <Image
                className="rounded-full absolute top-[-25px] left-[20px]"
                src={inscriptionData[0]?.collection.imageURI}
                width={48}
                height={48}
                alt={inscriptionData[0]?.meta.name}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#FFE297]">
                  {collectionDetails?.collection_name}
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
                <span className="text-[#FFE297]">
                  {collectionDetails?.rune_name}
                </span>
                <div className="space-x-2 flex justify-end">
                  <span className="text-[#FFE297] ">
                    {runeBalance / 10 ** collectionDetails?.rune_decimals}
                  </span>
                  <span>{collectionDetails?.rune_symbol}</span>
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
      ) : (
        <LoadHeader />
      )}
    </div>
  );
};

export default Header;
