import React from 'react'

import { IFees } from '@/types/fees'

interface PageProps {
    fees: IFees | null
}

const Fees = ({ fees }: PageProps) => {

    console.log(fees)
  return (
    <div className="flex justify-between items-center gap-2 cursor-pointer">
      <div className="flex flex-col items-center justify-center bg-[#222222] w-[80px] h-[45px] text-sm button-hover hover:bg-[#333333]">
        <span>Slow</span>
        <span>{fees?.minimumFee} S/VB</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-white w-[80px] h-[45px] text-sm button-hover hover:bg-[#333333]">
        <span className='text-black font-bold'>Avg</span>
        <span className='text-black font-bold'>{fees?.economyFee} S/VB</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-[#222222] w-[80px] h-[45px] text-sm button-hover hover:bg-[#333333]">
        <span>Fast</span>
        <span>{fees?.fastestFee} S/VB</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-[#222222] w-[80px] h-[45px] text-sm button-hover hover:bg-[#333333]">
        <span>Custom</span>
      </div>
    </div>
  );
};

export default Fees