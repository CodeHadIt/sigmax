"use client";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Wallets from "./wallets";

import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";
// { address }: { address: String | null }

interface IProps {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const WalletConnectDialog = ({ openDialog, setOpenDialog }: IProps) => {

  const { connectedAddress } = useContext(WalletConnectContext) as WalletContextInterface
  const handleDialog = () => {
    if (!connectedAddress) {
      setOpenDialog(false);
      console.log("hello");
    } 
    
  };

  return (
    <div className="">
      <Dialog open={openDialog} onOpenChange={handleDialog}>
        {/* <DialogTrigger>
        <Button variant="outline">Connect Wallet</Button>
      </DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <h3 className="text-lg text-[#D9D9D9] tracking-wide">Connect Wallet</h3>
            </DialogTitle>
            <DialogDescription>
              <p className="text-lg pb-6 leading-tight text-[#666666]">
                {`Choose How You Want To Connect. If You Don't Have A Wallet, You Can Select A Provider And Create One.`}
              </p>
            </DialogDescription>
          </DialogHeader>
          <Wallets />
          <div className="text-lg pt-6 leading-tight">
            <p className="pb-5">{`By connecting your wallet you acknowledge that selling either the staked Runes or the attached Ordinal will result in the sale of both, as staking binds them together.`}</p>
            <p>{`By connecting your wallet you acknowledge that unstaking is in development and therefore currently unavailable.`}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletConnectDialog;
