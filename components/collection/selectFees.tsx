import React, { Dispatch, SetStateAction } from 'react'
import { FormControl, FormItem, FormLabel } from '../ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IFees } from '@/types/fees';

interface PageProps {
  feeType: string;
  selectedFee: string;
  fees: IFees;
  form: any;
  setSelectedFee: Dispatch<SetStateAction<string>>;
}

const SelectFees = ({feeType, selectedFee, fees, form, setSelectedFee }: PageProps) => {
  return (
    <FormItem
      className={`flex flex-col items-center justify-center space-y-0 relative w-full h-[45px] bg-[#222222] hover:bg-[#FFE297] ${
        selectedFee === feeType && "bg-[#FFE297]"
      }`}
    >
      <FormLabel className="font-normal absolute flex flex-col inset-0 items-center justify-center gap-[6px]">
        <span>{feeType}</span>
      </FormLabel>
      <FormControl className="z-10 cursor-pointer">
        <RadioGroupItem
          value={feeType}
          className="w-full h-[50px] rounded-none border-none"
          onClick={() => {
            form.setValue("fee", Math.round(fees?.fastestFee * 1.2));
            setSelectedFee(feeType);
          }}
        />
      </FormControl>
    </FormItem>
  );
};

export default SelectFees