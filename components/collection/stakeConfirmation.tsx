("");
import React, { Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formData } from "./userform";

interface PageProps {
  handleStake: Function;
  formData: formData;
  inscriptionData: any;
  confirmAction: Dispatch<SetStateAction<boolean>>;
}

const StakeConfirmation = ({
  handleStake,
  formData,
  inscriptionData,
  confirmAction,
}: PageProps) => {
  const handleStaking = () => {
    const { stakeAmount, fee } = formData;
    handleStake(stakeAmount, fee);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <span className="text-[#FFE297]">
        Staking Transaction Summary
      </span>
      <div className="space-y-2">
        <Input
          type="text"
          placeholder={inscriptionData?.meta.name}
          id="stakeAmount"
          className="w-full]"
          readOnly
          //   value={inscriptionData?.meta.name}
        />
        <div className="">
          <span className="font-bold">Network Fees: </span>
          <span>{formData.fee} Sats</span>
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
          >
            Sign And Pay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StakeConfirmation;
