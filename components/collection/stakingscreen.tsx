import Link from 'next/link'
import React from 'react'

const StakingScreen = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <span>Staking in progress...</span>
        <div className="w-full h-[45px] bg-[#222222] flex justify-center items-center">
          <Link href="/"> View Tx in Mempool </Link>
        </div>
        <span>You Can Close This Screen.</span>
      </div>

      <div className="flex flex-col gap-2 text-[12px] max-w-[400px]">
        <span className="text-white">Please Note</span>
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
}

export default StakingScreen