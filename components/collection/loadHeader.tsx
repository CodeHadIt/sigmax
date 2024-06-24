import React from 'react'
import { Loader, LoaderCircle } from 'lucide-react';

const LoadHeader = () => {
  return (
    <div className="blue-border text-base p-8 flex justify-between items-center bg-[#111111] min-w-[1020px]">
      <div className="flex gap-6 justify-between items-center">
        <Loader size={64} color="#4446B1" className="animate-spin" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#FFE297]">Loading...</span>
            <LoaderCircle
              className="animate-spin"
              size={16}
              color="#4446B1"
            />
          </div>
          <span className="text-[#FFE297]">Loading...</span>
        </div>
      </div>

      <div>
        <span className="text-[#FFE297]">Loading...</span>
        <div className="space-x-2 flex justify-end items-center">
          <span className="text-[#FFE297] ">Loading...</span>
          <LoaderCircle className="animate-spin" color="#4446B1" size={16} />
        </div>
      </div>
    </div>
  );
}

export default LoadHeader