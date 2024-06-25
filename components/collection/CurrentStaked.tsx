import React, { useContext } from 'react';
import { WalletConnectContext } from '@/contexts/WalletConnectContext';
import { WalletContextInterface } from '@/types/wallets';
import { useMediaQuery } from 'react-responsive';

interface PageProps {
  inscriptionId: string;
  currentStake?: string;
}

const CurrentStaked = ({ currentStake }: PageProps) => {
  const { runeData } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  const isLargeScreens = useMediaQuery({ query: "(min-width: 768px)" });

  const formattedStake = currentStake
    ? (parseFloat(currentStake) * 10 ** -runeData.rune_decimals).toFixed(runeData.rune_decimals)
    : 'N/A';

  if(!isLargeScreens) {
    return <div className="">Staked: {formattedStake}</div>;
  }

  return <div className="">Currently staked: {formattedStake}</div>;
};

export default CurrentStaked;
