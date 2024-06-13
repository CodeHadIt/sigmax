'use client';
import { FC, createContext, useMemo, useState } from 'react';
import {
  walletContextProviderProps,
  WalletContextInterface,
  connectedWallet,
} from '@/types/wallets';
import {
  AddressPurpose,
  BitcoinNetworkType,
  GetAddressOptions,
  getAddress,
} from 'sats-connect';
import { useWallet, useWallets } from '@wallet-standard/react';
import type { Wallet, WalletWithFeatures } from '@wallet-standard/base';

const SatsConnectNamespace = 'sats-connect:';

export const WalletConnectContext = createContext<WalletContextInterface>(
  {} as WalletContextInterface
);

function isSatsConnectCompatibleWallet(wallet: Wallet) {
  return SatsConnectNamespace in wallet.features;
}

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

  const [inscriptionData, setInscriptionData] = useState<any>([]);
  const [runeData, setRuneData] = useState<any>(null);

  const { wallets } = useWallets();
  const { setWallet, wallet } = useWallet();

  const compatibleWallets = useMemo(() => {
    return wallets.filter(isSatsConnectCompatibleWallet);
  }, [wallets]);

  console.log(compatibleWallets, wallets, 'isSatsConnectCompatibleWallet');

  const getInscription = async (address?: string) => {
    const response = await fetch(`/api/inscriptions/${address}`);
    let details = await response.json();
    let collection = details?.tokens.filter(
      (detail: any) =>
        detail.collectionSymbol && detail.collectionSymbol.includes('sigmax')
    );
    setInscriptionData(collection);
  };

  const getRunes = async (address?: string) => {
    const response = await fetch(`/api/runes/${address}`);
    let resJson = await response.json();
    if (resJson?.utxos?.length) {
      setRuneData(resJson);
    }
  };

  const getConnectedAddress = (wallet: string) => {
    if (wallet === 'unisat') {
      getUnisatAddress();
    } else if (wallet === 'xverse') {
      getXverseAddress();
    } else if (wallet.toLocaleLowerCase() == 'Magic Eden'.toLocaleLowerCase()) {
      getMagicEdenAddress();
    }
  };

  const getUnisatAddress = async () => {
    if (typeof window.unisat !== 'undefined') {
      try {
        let accounts = await window.unisat.requestAccounts();
        let pubkey = await window.unisat.getPublicKey();
        setConnectedAddress(accounts[0]);
        await getInscription(accounts[0]);
        await getRunes(accounts[0]);
        setConnectedPubkey(pubkey);
        setConnectedWallet('unisat');
      } catch (e: any) {
        if (e.code === 4001) {
          alert(e.message);
        } else {
          console.log('connecting to unisat failed');
          alert('error connecting to unisat ');
        }
      }
    } else {
      alert('Please Install Unisat Wallet');
    }
  };

  const getAddressOptions: GetAddressOptions = {
    payload: {
      purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
      message: 'Address for interracting with Dapp',
      network: {
        type: BitcoinNetworkType.Mainnet,
      },
    },
    onFinish: (response: any) => {
      const addresses = {
        ordinal: response.addresses[0].address,
        payment: response.addresses[1].address,
      };
      console.log(addresses);

      setConnectedAddress(addresses.ordinal);
      setConnectedPubkey(response.addresses[1].publicKey);

      setConnectedTaprootAddress(addresses.ordinal);
      setConnectedTaprootPubkey(response.addresses[0].publicKey);

      getInscription(addresses.ordinal);
      getRunes(addresses.ordinal);
    },
    onCancel: () => alert('Wallet not connected. You cancelled the request.'),
  };

  const getXverseAddress = async () => {
    if (typeof window.XverseProviders == 'undefined') {
      alert('Please Install Xverse Wallet');
    } else {
      try {
        await getAddress({
          ...getAddressOptions,
          getProvider: async () => {
            return window.XverseProviders.BitcoinProvider;
          },
        });
        setConnectedWallet('xverse');
      } catch (error: any) {
        alert(`${error.message}`);
      }
    }
  };

  const getMagicEdenAddress = async () => {
    const magicEdenWalletProvider = compatibleWallets.filter(
      (w) => w.name.toLocaleLowerCase() === 'Magic Eden'.toLocaleLowerCase()
    );

    if (magicEdenWalletProvider.length == 0) {
      alert('Please Install Magic Eden Wallet');
    } else {
      try {
        await getAddress({
          ...getAddressOptions,
          getProvider: async () => {
            return (
              magicEdenWalletProvider[0] as unknown as WalletWithFeatures<any>
            ).features[SatsConnectNamespace]?.provider;
          },
        });
        setConnectedWallet('Magic Eden');
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
