import { WalletConnectContext } from '@/contexts/WalletConnectContext';
import { WalletContextInterface } from '@/types/wallets';
import { useContext, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import stakedIcon from '@/public/images/svg/stake-icon.svg';
import Image from 'next/image';

// import RuneDailog from "";
const RuneDailog = dynamic(() => import('./runedailog'), {
  loading: () => <p>Loading...</p>,
});

const Body = () => {
  const { inscriptionData, runeData } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  const stakedRunesInfo = useMemo(() => {
    if (inscriptionData.length && runeData?.utxos.length) {
      const stakedUtxos = runeData?.utxos.filter((i) =>
        inscriptionData.find((utxo: any) => utxo.output === i.location)
      );
      const sum = stakedUtxos.reduce((acc, utxo) => acc + utxo.balance, 0);
      return { stakedUtxos, sum };
    } else {
      return { stakedUtxos: [], sum: 0 };
    }
  }, [inscriptionData, runeData?.utxos]);

  return (
    <div className="space-y-7 text-base">
      <span>Select An Item to Stake Your runes With.</span>
      <div className="grid grid-cols-7 gap-4">
        {inscriptionData?.map((data: any, index: any) => {
          const hasUtxo = runeData?.utxos.find(
            (utxo: any) => utxo.location === data.output
          );
          return hasUtxo ? (
            <div className="relative" key={index}>
              <RuneDailog
                stakedRunesInfo={stakedRunesInfo}
                inscriptionData={data}
                runeBalance={hasUtxo.balance}
              />
              <Image
                src={stakedIcon}
                alt="staking_icon"
                className="absolute top-3 right-3"
              />
            </div>
          ) : (
            <RuneDailog key={index} stakedRunesInfo={stakedRunesInfo} inscriptionData={data} />
          );
        })}
      </div>
    </div>
  );
};

export default Body;
