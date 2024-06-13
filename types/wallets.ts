import { ReactNode, Dispatch, SetStateAction } from "react";

export type walletContextProviderProps = {
  children: ReactNode;
};

export type connectedWallet = "unisat" | "xverse" | "Magic Eden";

export interface WalletContextInterface {
  connectedWallet: connectedWallet;
  connectedAddress: string | null;
  connectedPubkey: string | null;
  connectedTaprootAddress: string | null;
  connectedTaprootPubkey: string | null;
  inscriptionData: any;
  runeData: any;
  setConnectedWallet: Dispatch<SetStateAction<connectedWallet>>;
  setConnectedAddress: Dispatch<SetStateAction<string | null>>;
  setInscriptionData: Dispatch<SetStateAction<any>>;
  setRuneData: Dispatch<SetStateAction<any>>;
  getConnectedAddress: (wallet: string) => void;
}
