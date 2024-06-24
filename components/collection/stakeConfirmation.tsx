('');
import React, { useState, Dispatch, SetStateAction } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { formData } from './userform';
import { usePathname } from 'next/navigation';
import { PartnerCollections } from '@/data/collections';

interface PageProps {
  runeData: any;
  handleStake: Function;
  formData: formData;
  inscriptionData: any;
  confirmAction: Dispatch<SetStateAction<boolean>>;
}

const StakeConfirmation = ({
  runeData,
  handleStake,
  formData,
  inscriptionData,
  confirmAction,
}: PageProps) => {
  const [loading, setLoading] = useState(false);

  const pathName = usePathname().replace('/', '');
  const collectionDetails = PartnerCollections.find(
    (collection: any) => collection.slug === pathName
  );

  const handleStaking = () => {
    setLoading(true);
    const { stakeAmount, fee } = formData;
    handleStake(stakeAmount * 10 ** runeData.rune_decimals, fee);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <span className="text-[#FFE297]">Staking Transaction Summary</span>
      <div className="space-y-2">
        <Input
          type="text"
          placeholder={`${inscriptionData?.meta.name} + ${formData.stakeAmount} ${collectionDetails.rune_symbol}`}
          id="stakeAmount"
          className="w-full]"
          readOnly
        />
        <div className="">
          <span className="text-[13px]">Network Fees: </span>
          <span className="text-[13px]">~{Math.round(formData.fee)} S/VB</span>
        </div>
        <div className="text-[13px] max-w-[600px]">
          By Signing This Transaction You Acknowledge That Selling Either The
          Staked Runes or The Attached Ordinal Will Result in The Sale of Both,
          as Staking Binds Them Together.
        </div>

        <div className="flex gap-2">
          <Button
            className="button-hover w-full cursor-pointer"
            onClick={() => confirmAction(false)}
          >
            Reject
          </Button>
          <Button
            className="button-hover w-full cursor-pointer"
            onClick={() => handleStaking()}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign And Pay'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StakeConfirmation;
