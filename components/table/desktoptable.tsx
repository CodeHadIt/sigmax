import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { PartnerCollections } from "@/data/collections";
import Image from "next/image";

const DesktopTable = () => {
  return (
    <div>
      <Table className="hover:cursor-pointer">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ordinal</TableHead>
            <TableHead>Rune</TableHead>
            <TableHead># Staked</TableHead>
            <TableHead className="text-right">% Stakers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PartnerCollections.map((collection) => (
            <TableRow key={collection.slug} className="border border-red-500 flex flex-col md:table-row">
              <TableCell className="flex justify-between items-center gap-8 mr-20">
                <Image
                  src={collection.image}
                  width={35}
                  height={35}
                  alt={`${collection.collection_symbol} collection image`}
                />
                <span className="text-[#FFE297]">
                  {collection.collection_name}
                </span>
              </TableCell>
              <TableCell>{collection.rune_name}</TableCell>
              <TableCell>{collection.rune_symbol}</TableCell>
              <TableCell className="text-right">
                {collection.rune_decimals}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DesktopTable