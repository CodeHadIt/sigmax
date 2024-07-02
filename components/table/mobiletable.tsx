import React from 'react'
import { PartnerCollections } from '@/data/collections'
import Image from 'next/image';

const MobileTable = () => {
  return (
    <div className="w-full cursor-pointer">
      {PartnerCollections.map((collection) => (
        <div
          className="p-6 border-b border-[#4446b1] flex gap-6 items-center transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          key={collection.slug}
        >
          <Image
            src={collection.image}
            width={50}
            height={50}
            alt={`${collection.collection_symbol} collection image`}
          />
          <div className="flex flex-col">
            <span className="text-[#FFE297]">{collection.collection_name}</span>
            <span className="text-[#FFE297]">{collection.rune_name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MobileTable;