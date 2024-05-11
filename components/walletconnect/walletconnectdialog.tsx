"use client";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Wallets from "./wallets";

import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";

interface IProps {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const WalletConnectDialog = ({ openDialog, setOpenDialog }: IProps) => {

  const { connectedAddress } = useContext(WalletConnectContext) as WalletContextInterface
  const handleDialog = () => {
    //Unless user connects wallet, dialog pops up
    if (connectedAddress) {
      setOpenDialog(false);
    } 
  };

  useEffect(() => {
    if (connectedAddress) {
      setOpenDialog(false);
    } else {
      setOpenDialog(true);
    }
  }, [connectedAddress, setOpenDialog]);

  return (
    <div className="">
      <Dialog open={openDialog} onOpenChange={handleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <h3 className="text-lg text-[#D9D9D9] tracking-wide">Connect Wallet</h3>
            </DialogTitle>
            <DialogDescription>
              <p className="text-lg pb-6 leading-tight text-[#666666]">
                {`Choose A Wallet To Connect With`}
              </p>
            </DialogDescription>
          </DialogHeader>
          <Wallets />
          <div className="text-lg pt-6 leading-tight">
            <p className="pb-5">{`Warning: Selling either the staked Runes or the attached Ordinal will result in the sale of both, as staking binds them together.`}</p>
            <p>{`Warning: Unstaking is in development and not currently available.`}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletConnectDialog;
