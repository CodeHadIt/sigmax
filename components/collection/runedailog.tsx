'use client'
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import Image from 'next/image';
import { useState } from 'react';
import UserForm from './userform';

import { IFees } from '@/types/fees';
import StakingScreen from './stakingscreen';

const RuneDailog = ({ inscriptionData}: any) => {
    const [fees, setFees] = useState<IFees | null>(null);
    const [formIsSubmitted, setFormIsSubmitted] = useState<boolean>(false);

    const fetchfees = async () => {
        const response = await fetch(
          "https://mempool.space/api/v1/fees/recommended"
        );
        const data = await response.json();
        setFees(data)
    }

    const numberPattern = /\d+/;
    const extractedNumber = inscriptionData?.metadata.name.match(numberPattern);
    const sigmaNo = extractedNumber ? parseInt(extractedNumber[0]) : null;
    const sigmaPath = "https://ordinalsigmax.com/osx-gifs2/" + sigmaNo + ".gif";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="max-w-[138px] button-hover">
          <Image
            src={sigmaPath}
            width={135}
            height={135}
            alt={inscriptionData?.inscription_name}
            onClick={() => fetchfees()}
            className="cursor-pointer"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[665px]">
        <div className="flex justify-between gap-6 items-center text-md">
          <div className="space-y-3 ">
            <div className="flex justify-between items-center">
              <span>{inscriptionData?.inscription_name}</span>
              <span className="lowercase">{`${inscriptionData?.inscription_id.slice(
                0,
                5
              )}...${inscriptionData?.inscription_id.slice(-5)}`}</span>
            </div>

            <Image
              src={sigmaPath}
              width={240}
              height={240}
              alt={inscriptionData?.inscription_name}
            />

            <div className="flex justify-between">
              <span>{`<Prev`}</span>
              <span>{`Next>`}</span>
            </div>
          </div>

          <div className="flex space-y-3 flex-col">
            <span className="self-end">{`<ESC>`}</span>
            {formIsSubmitted ? (
              <StakingScreen />
            ) : (
              <UserForm fees={fees} setFormIsSubmitted={setFormIsSubmitted} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RuneDailog