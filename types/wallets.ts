import {
  ReactNode,
  FC,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export type walletContextProviderProps = {
  children: ReactNode;
};

export type connectedWallet = "unisat" | "xverse" | null;

export interface WalletContextInterface {
  connectedAddress: string | null;
  connectedWallet: connectedWallet;
  setConnectedWallet: Dispatch<SetStateAction<connectedWallet>>;
  getConnectedAddress: (wallet: string) => void;
  setConnectedAddress: Dispatch<SetStateAction<string | null>>;
}

