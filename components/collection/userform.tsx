import React, { useContext, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '../ui/input';
import { WalletContextInterface } from '@/types/wallets';
import { WalletConnectContext } from '@/contexts/WalletConnectContext';

import { IFees } from '@/types/fees';

import { PartnerCollections } from '@/data/collections';
import StakeConfirmation from './stakeConfirmation';
import SelectFees from './selectFees';
import { usePathname } from 'next/navigation';

interface PageProps {
  stakedRunesInfo: any;
  fees: IFees | null;
  handleStake: Function;
  loading: boolean;
  inscriptionData: any;
}

type feeOptions = 'slow' | 'average' | 'fast' | 'none';
export type formData = {
  stakeAmount: number;
  fee: number;
};

const FormSchema = z
  .object({
    divisibility: z.coerce.number().optional(),
    runeBalance: z.coerce.number().optional(),
    stakeAmount: z.coerce.number().gt(0, {
      message: 'Amount must not be 0',
    }),
    fee: z.coerce.number().optional(),
    type: z.enum(['slow', 'average', 'fast'], {
      required_error: 'Please select a fee.',
    }),
  })
  .refine(
    (data) =>
      Number(data.stakeAmount * 10 ** data.divisibility) <=
      Number(data.runeBalance),
    {
      message: 'Rune amount cannot be larger than your balance',
      path: ['stakeAmount'],
    }
  );

const UserForm = ({
  stakedRunesInfo,
  fees,
  handleStake,
  loading,
  inscriptionData,
}: PageProps) => {
  const { runeData } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  const [selectedFee, setSelectedFee] = useState<feeOptions>('none');
  const [hasClickedConfirm, setHasClickedConfirm] = useState(false);
  const [formData, setFormData] = useState<formData | null>(null);

  const pathName = usePathname().replace('/', '');
  const collectionDetails = PartnerCollections.find(
    (collection: any) => collection.slug === pathName
  );

  const runeBalance = runeData?.utxos.reduce(
    (accumulator, utxo) => accumulator + utxo.balance,
    0
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      divisibility: runeData.rune_decimals,
      runeBalance: runeBalance - stakedRunesInfo.sum,
      stakeAmount: undefined,
      fee: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const { stakeAmount, fee } = data;
    setFormData({ stakeAmount, fee });
    setHasClickedConfirm(true);
    // handleStake(stakeAmount, fee);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {hasClickedConfirm ? (
        <StakeConfirmation
          runeData={runeData}
          handleStake={handleStake}
          formData={formData}
          inscriptionData={inscriptionData}
          confirmAction={setHasClickedConfirm}
        />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full h-full flex flex-col justify-between gap-5"
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
                        form.setValue(
                          "stakeAmount",
                          Number(
                            (runeBalance - stakedRunesInfo.sum) /
                              10 ** collectionDetails?.rune_decimals
                          )
                        )
                      }
                    >
                      Max
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available</span>
                    <div className="space-x-2">
                      <span className="">
                        {(runeBalance - stakedRunesInfo.sum) /
                          10 ** collectionDetails?.rune_decimals}
                      </span>
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
                    Select Transaction Speed
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-between"
                    >
                      <SelectFees
                        feeType="fast"
                        selectedFee={selectedFee}
                        fees={fees}
                        form={form}
                        setSelectedFee={setSelectedFee}
                      />
                      <SelectFees
                        feeType="average"
                        selectedFee={selectedFee}
                        fees={fees}
                        form={form}
                        setSelectedFee={setSelectedFee}
                      />
                      <SelectFees
                        feeType="slow"
                        selectedFee={selectedFee}
                        fees={fees}
                        form={form}
                        setSelectedFee={setSelectedFee}
                      />
                    </RadioGroup>
                  </FormControl>

                  <div className="flex gap-2 pt-2 md:pt-0">
                    <Button
                      type="submit"
                      className="w-full cursor-pointer hover:bg-[#FFE297] hover:text-[#222222]"
                    >
                      {loading ? "Staking..." : "Stake"}
                    </Button>
                    <Button
                      className="w-full hover:bg-unset hover:text-unset"
                      disabled
                    >
                      Unstake
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </div>
  );
};

export default UserForm;
