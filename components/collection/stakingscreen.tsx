import Link from "next/link";
import React from "react";

interface PageProps {
  transactionId: string;
}

const StakingScreen = ({ transactionId }: PageProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <span>Staking in progress...</span>
        <div className="w-full h-[45px] bg-[#222222] flex justify-center items-center">
          <Link
            href={`https://mempool.space/tx/${transactionId}`}
            target="_blank"
          >
            View Tx in Mempool{" "}
          </Link>
        </div>
        <span>You Can Close This Screen.</span>
      </div>

      <div className="flex flex-col gap-2 text-[12px] max-w-[400px]">
        <span className="text-[#D9D9D9]">Please Note</span>
        <span className="">
          Selling Either The Staked Runes Or The Attached Ordinal Will result In
          The Sale Of Both, As Staking Binds Them Together.
        </span>
        <span>
          Unstaking Is In Development And Therefore Currently Unavailable.
        </span>
      </div>
    </div>
  );
};

export default StakingScreen;