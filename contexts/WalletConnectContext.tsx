"use client";
import { FC, createContext, useEffect, useState } from "react";
import {
  walletContextProviderProps,
  WalletContextInterface,
  connectedWallet,
} from "@/types/wallets";
import {
  AddressPurpose,
  BitcoinNetworkType,
  GetAddressOptions,
  getAddress,
} from "sats-connect";


export const WalletConnectContext = createContext<WalletContextInterface>(
  {} as WalletContextInterface
);

const WalletConnectContextProvider: FC<walletContextProviderProps> = ({ children }) => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<connectedWallet>(null);

  const getConnectedAddress = (wallet: string) => {
    if (wallet === "unisat") {
      getUnisatAddress();
    } else if (wallet === "xverse") {
      getXverseAddress();
    }
  };

  const getUnisatAddress = async () => {
    if (typeof window.unisat !== "undefined") {
      try {
        let accounts = await window.unisat.requestAccounts();
        setConnectedAddress(accounts[0]);
        setConnectedWallet("unisat");
      } catch (e: any) {
        if(e.code === 4001) {
            alert(e.message);
        } else {
            console.log("connecting to unisat failed");
            alert("error connecting to unisat ");
        }
      }
    } else {
      alert("Please Install Unisat Wallet");
    }
  };

  const getAddressOptions: GetAddressOptions = {
    payload: {
      purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
      message: "Address for interracting with Dapp",
      network: {
        type: BitcoinNetworkType.Mainnet,
      },
    },
    onFinish: (response: any) => {
      const addresses = {
        ordinal: response.addresses[0].address,
        payment: response.addresses[1].address,
      };
      setConnectedAddress(addresses.ordinal);
        setConnectedWallet("xverse");
    },
    onCancel: () => alert("Wallet not connected. You cancelled the request."),
  };

  const getXverseAddress = async () => {
    if (typeof window.XverseProviders == "undefined") {
        alert("Please Install Xverse Wallet");
    } else {
        try {
          await getAddress(getAddressOptions);
        } catch (error: any) {
          alert(`${error.message}`);
        }
    }
  };

  return (
    <WalletConnectContext.Provider
      value={{
        connectedAddress,
        connectedWallet,
        setConnectedWallet,
        getConnectedAddress,
        setConnectedAddress,
      }}
    >
      <div>{children}</div>
    </WalletConnectContext.Provider>
  );
};

export default WalletConnectContextProvider;
