'use client'
import React, { Dispatch, SetStateAction, useContext } from 'react'

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


interface PageProps {
  fees: IFees | null;
  setFormIsSubmitted: Dispatch<SetStateAction<boolean>>;
}

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

const UserForm = ({ fees, setFormIsSubmitted }: PageProps) => {
  const { runeData } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      runeBalance: runeData?.total_balance,
      stakeAmount: undefined,
      fee: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const { stakeAmount, fee } = data;
    console.log(stakeAmount, fee);
    if(form.formState.isSubmitSuccessful) {
      setFormIsSubmitted(true);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="stakeAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="stakeAmount"
                  className="text-right text-[#d9d9d9]"
                >
                  Enter The Amount Of Runes To Stake
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="E.G 69,420.69"
                      id="stakeAmount"
                      className="min-w-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <span
                    className="absolute top-[25%] left-[88%] text-white cursor-pointer"
                    onClick={() =>
                      form.setValue("stakeAmount", runeData?.total_balance)
                    }
                  >
                    Max
                  </span>
                </div>

                <FormMessage className="text-[12px]" />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <span>Available</span>
            <div className="space-x-2">
              <span className="text-[#d9d9d9]">{runeData?.total_balance}</span>
              <span>Σ</span>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-[#d9d9d9]">
                Select A Fee Rate
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center"
                >
                  <FormItem className="flex flex-col items-center justify-center space-y-0 relative w-[80px] h-[45px] bg-[#222222] button-hover hover:bg-[#333333]">
                    <FormLabel className="font-normal absolute flex flex-col inset-0 items-center justify-center gap-[6px]">
                      <span>Slow</span>
                      <span>{fees?.minimumFee} S/VB</span>
                    </FormLabel>
                    <FormControl className="z-10">
                      <RadioGroupItem
                        value="slow"
                        className="w-full h-[50px] rounded-none border-none"
                        onClick={() => {
                          form.setValue("fee", fees?.minimumFee);
                        }}
                      />
                    </FormControl>
                  </FormItem>

                  <FormItem className="flex flex-col items-center justify-center space-y-0 relative w-[80px] h-[45px] bg-[#222222] button-hover hover:bg-[#333333]">
                    <FormLabel className="font-normal absolute flex flex-col inset-0 items-center justify-center gap-[6px]">
                      <span>Avg</span>
                      <span>{fees?.economyFee} S/VB</span>
                    </FormLabel>
                    <FormControl className="z-10">
                      <RadioGroupItem
                        value="average"
                        className="w-full h-[50px] rounded-none border-none"
                        onClick={() => {
                          form.setValue("fee", fees?.economyFee);
                        }}
                      />
                    </FormControl>
                  </FormItem>

                  <FormItem className="flex flex-col items-center justify-center space-y-0 relative w-[80px] h-[45px] bg-[#222222] button-hover hover:bg-[#333333]">
                    <FormLabel className="font-normal absolute flex flex-col inset-0 items-center justify-center gap-[6px]">
                      <span>Fast</span>
                      <span>{fees?.fastestFee} S/VB</span>
                    </FormLabel>
                    <FormControl className="z-10">
                      <RadioGroupItem
                        value="fast"
                        className="w-full h-[50px] rounded-none border-none"
                        onClick={() => {
                          form.setValue("fee", fees?.fastestFee);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="button-hover w-full">
          Stake
        </Button>
      </form>
    </Form>
  );
};

export default UserForm