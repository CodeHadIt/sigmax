"use client";
import { FC, createContext, useState } from "react";
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

const WalletConnectContextProvider: FC<walletContextProviderProps> = ({
  children,
}) => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [connectedPubkey, setConnectedPubkey] = useState<string | null>(null);
  const [connectedTaprootAddress, setConnectedTaprootAddress] = useState<
    string | null
  >(null);
  const [connectedTaprootPubkey, setConnectedTaprootPubkey] = useState<
    string | null
  >(null);
  const [connectedWallet, setConnectedWallet] = useState<connectedWallet>(null);

  const [inscriptionData, setInscriptionData] = useState<any>(null);
  const [runeData, setRuneData] = useState<any>(null);

  const getInscription = async (address?: string) => {
    const response = await fetch(`/api/inscriptions/${address}`);
    let details = await response.json();
    console.log({details, address})
    // let collection = details?.tokens.filter(
    //   (detail: any) =>
    //     detail.collectionSymbol && detail.collectionSymbol.includes("sigmax")
    // );
    setInscriptionData(details?.tokens);
  };

  const getRunes = async (address?: string) => {
    const response = await fetch(`/api/runes/${address}`);
    let runeData = await response.json();

    console.log(runeData)
    setRuneData(runeData);
    
  };

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
        let pubkey = await window.unisat.getPublicKey();
        setConnectedAddress(accounts[0]);
        await getInscription(accounts[0]);
        await getRunes(accounts[0]);
        setConnectedPubkey(pubkey);
        setConnectedWallet("unisat");
      } catch (e: any) {
        if (e.code === 4001) {
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
      setConnectedAddress(addresses.payment);
      setConnectedPubkey(response.addresses[1].publicKey);

      setConnectedTaprootAddress(addresses.ordinal);
      setConnectedTaprootPubkey(response.addresses[0].publicKey);

      getInscription(addresses.ordinal);
      getRunes(addresses.ordinal);
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
        connectedWallet,
        connectedAddress,
        connectedPubkey,
        connectedTaprootAddress,
        connectedTaprootPubkey,
        inscriptionData,
        runeData,
        setInscriptionData,
        setConnectedWallet,
        setConnectedAddress,
        setRuneData,
        getConnectedAddress,
      }}
    >
      <div>{children}</div>
    </WalletConnectContext.Provider>
  );
};

export default WalletConnectContextProvider;
