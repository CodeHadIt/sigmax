("");

import React, { Dispatch, SetStateAction, useContext, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from '../ui/input';
import { WalletContextInterface } from '@/types/wallets';
import { WalletConnectContext } from '@/contexts/WalletConnectContext';

import { IFees } from "@/types/fees";

import { PartnerCollections } from "@/data/collections";
import { usePathname } from "next/navigation";

interface PageProps {
  fees: IFees | null;
  handleStake: Function;
  loading: boolean;
}

type feeOptions = "slow" | "average" | "fast" | "none";

const FormSchema = z
  .object({
    runeBalance: z.coerce.number().optional(),
    stakeAmount: z.coerce.number().min(1, {
      message: "Amount must not be empty",
    }),
    fee: z.coerce.number().optional(),
    type: z.enum(["slow", "average", "fast"], {
      required_error: "Please select a fee.",
    }),
  })
  .refine((data) => Number(data.stakeAmount) <= Number(data.runeBalance), {
    message: "Stake amount cannot be larger than your balance",
    path: ["stakeAmount"],
  });


const UserForm = ({ fees, handleStake, loading }: PageProps) => {
  const { runeData } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  const [selectedFee, setSelectedFee] = useState<feeOptions>("none")

  const pathName = usePathname().replace("/", "");
  const collectionDetails = PartnerCollections.find((collection: any) => collection.slug === pathName)

  const runeBalance = runeData?.utxos.reduce((accumulator, utxo) => accumulator + utxo.balance, 0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      runeBalance: runeBalance,
      stakeAmount: undefined,
      fee: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const { stakeAmount, fee } = data;
    handleStake(stakeAmount, fee);
  };

  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col justify-between"
      >
        <FormField
          control={form.control}
          name="stakeAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="stakeAmount"
                className="text-right text-[#FFE297] my-[-2px]"
              >
                Enter The Amount Of Runes To Stake
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="E.G 69,420.69"
                    id="stakeAmount"
                    className="w-full]"
                    {...field}
                  />
                </FormControl>
                <span
                  className="absolute top-[25%] left-[88%] text-[#FFE297] cursor-pointer"
                  onClick={() =>
                    form.setValue("stakeAmount", Number(runeBalance))
                  }
                >
                  Max
                </span>
              </div>
              <div className="flex justify-between">
                <span>Available</span>
                <div className="space-x-2">
                  <span className="">{runeBalance}</span>
                  <span>{collectionDetails?.rune_symbol}</span>
                </div>
              </div>

              <FormMessage className="text-[12px]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-[#FFE297]">
                Select A Fee Rate
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex justify-between"
                >
                  <FormItem
                    className={`flex flex-col items-center justify-center space-y-0 relative w-full h-[45px] bg-[#222222] hover:bg-[#FFE297] ${
                      selectedFee === "slow" && "bg-[#FFE297]"
                    }`}
                  >
                    <FormLabel className="font-normal absolute flex flex-col inset-0 items-center justify-center gap-[6px]">
                      <span>Slow</span>
                      <span>{fees?.hourFee} S/VB</span>
                    </FormLabel>
                    <FormControl className="z-10 cursor-pointer">
                      <RadioGroupItem
                        value="slow"
                        className="w-full h-[50px] rounded-none border-none"
                        onClick={() => {
                          form.setValue("fee", fees?.hourFee);
                          setSelectedFee("slow");
                        }}
                      />
                    </FormControl>
                  </FormItem>

                  <FormItem
                    className={`flex flex-col items-center justify-center space-y-0 relative w-full h-[45px] bg-[#222222] hover:bg-[#FFE297] ${
                      selectedFee === "average" && "bg-[#FFE297]"
                    }`}
                  >
                    <FormLabel className="font-normal absolute flex flex-col inset-0 items-center justify-center gap-[6px]">
                      <span>Avg</span>
                      <span>{fees?.halfHourFee} S/VB</span>
                    </FormLabel>
                    <FormControl className="z-10 cursor-pointer">
                      <RadioGroupItem
                        value="average"
                        className="w-full h-[50px] rounded-none border-none"
                        onClick={() => {
                          form.setValue("fee", fees?.halfHourFee);
                          setSelectedFee("average");
                        }}
                      />
                    </FormControl>
                  </FormItem>

                  <FormItem
                    className={`flex flex-col items-center justify-center space-y-0 relative w-full h-[45px] bg-[#222222] hover:bg-[#FFE297] ${
                      selectedFee === "fast" && "bg-[#FFE297]"
                    }`}
                  >
                    <FormLabel className="font-normal absolute flex flex-col inset-0 items-center justify-center gap-[6px]">
                      <span>Fast</span>
                      <span>{fees?.fastestFee} S/VB</span>
                    </FormLabel>
                    <FormControl className="z-10 cursor-pointer focus:bg-[#D9D9D9}">
                      <RadioGroupItem
                        value="fast"
                        className="w-full h-[50px] rounded-none border-none"
                        onClick={() => {
                          form.setValue("fee", fees?.fastestFee);
                          setSelectedFee("fast");
                        }}
                      />
                    </FormControl>
                  </FormItem>
                </RadioGroup>
              </FormControl>

              <Button
                type="submit"
                className="button-hover w-full cursor-pointer"
              >
                {loading ? "Staking..." : "Stake"}
              </Button>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default UserForm