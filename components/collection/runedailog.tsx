'use client'
import React, { useContext, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WalletConnectContext } from '@/contexts/WalletConnectContext';
import { WalletContextInterface } from '@/types/wallets';
import Image from 'next/image';
import { Button } from '../ui/button';

import { IFees } from '@/types/fees';
import Fees from './fees';

const RuneDailog = ({ inscriptionData}: any) => {
    const { runeData } = useContext(
      WalletConnectContext
    ) as WalletContextInterface;
    const [fees, setFees] = useState<IFees | null>(null);

    const fetchfees = async () => {
        const response = await fetch(
          "https://mempool.space/api/v1/fees/recommended"
        );
        const data = await response.json();
        setFees(data)
    }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-4 bg-[#222222] max-w-[138px]">
          <Image
            src={inscriptionData?.metadata.collection_page_img_url}
            width={135}
            height={135}
            alt={inscriptionData?.inscription_name}
            onClick={() => fetchfees()}
            className="cursor-pointer"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <div className="flex justify-between items-center ">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>{inscriptionData?.inscription_name}</span>
              <span className="text-sm">{`${inscriptionData?.inscription_id.slice(
                0,
                5
              )}...${inscriptionData?.inscription_id.slice(-5)}`}</span>
            </div>

            <Image
              src={inscriptionData?.metadata.collection_page_img_url}
              width={240}
              height={240}
              alt={inscriptionData?.inscription_name}
            />

            <div className="flex justify-between">
              <span>{`<Prev`}</span>
              <span>{`Next>`}</span>
            </div>
          </div>

          <div className="flex gap-6 flex-col">
            <span className="self-end">{`<ESC>`}</span>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-right text-white">
                Enter The Amount Of Runes To Stake
              </Label>
              <div className="relative">
                <Input
                  placeholder="E.G 69,420.69"
                  id="amount"
                  className="min-w-[300px]"
                />
                <span className="absolute top-[25%] left-[88%] text-white cursor-pointer">
                  Max
                </span>
              </div>

              <div className="flex justify-between">
                <span>Available</span>
                <div className="space-x-2">
                  <span className="text-white">{runeData?.total_balance}</span>
                  <span>🍕</span>
                </div>
              </div>
            </div>

            <div className="">
              <span className="text-white">Select A Fee Rate</span>
              <div className="">
                <Fees fees={fees} />
              </div>
            </div>

            <Button type="submit">Stake</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RuneDailog