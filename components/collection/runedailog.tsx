import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import UserForm from './userform';
import StakingScreen from './stakingscreen';
import openAPI from '@/services/openAPI';
import bigInt from 'big-integer';
import { usePathname } from 'next/navigation';
import * as bitcoin from 'bitcoinjs-lib';
import { useContext, useState } from 'react';
import { IFees } from '@/types/fees';
import { WalletConnectContext } from '@/contexts/WalletConnectContext';
import { WalletContextInterface } from '@/types/wallets';
import {
  calculateFee,
  satoshisToBTC,
  toPsbt,
  utxoToInput,
  getAddressType,
  base64ToPsbt,
} from '@/utils';
import { RuneId, Runestone } from 'runestone-js';
import { U128, U32, U64 } from 'big-varuint-js';
import { InscriptionUtxoDetail, TransactionData } from '@/types/transaction';
import { BitcoinNetworkType, signTransaction } from 'sats-connect';
import CurrentStaked from './CurrentStaked';
import type { WalletWithFeatures } from '@wallet-standard/base';

interface DialogProps {
  stakedRunesInfo: any;
  inscriptionData: any;
  runeBalance?: string;
}

const SatsConnectNamespace = 'sats-connect:';

const RuneDailog = ({
  stakedRunesInfo,
  inscriptionData,
  runeBalance,
}: DialogProps) => {
  const {
    compatibleWallets,
    connectedAddress,
    runeData,
    connectedPubkey,
    connectedWallet,
    connectedTaprootAddress,
    connectedTaprootPubkey,
  } = useContext(WalletConnectContext) as WalletContextInterface;

  const [fees, setFees] = useState<IFees | null>(null);
  const [formIsSubmitted, setFormIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>();
  const [error, setError] = useState<string>();

  const fetchfees = async () => {
    const response = await fetch(
      'https://mempool.space/api/v1/fees/recommended'
    );
    const data = await response.json();
    setFees(data);
  };

  const numberPattern = /\d+/;
  const extractedNumber = inscriptionData?.meta.name.match(numberPattern);
  const pathName = usePathname().replace('/', '');
  const sigmaNo = extractedNumber ? parseInt(extractedNumber[0]) : null;
  const sigmaPath =
    'https://ewr1.vultrobjects.com/osx2/gif/' + sigmaNo + '.gif';
  const rugsPath = 'https://ewr1.vultrobjects.com/rugs/img/' + sigmaNo + '.png';
  const ordinalPath = 'https://ordinals.com/inscription/' + inscriptionData?.id;

  const imagePath =
    pathName === 'sigmax' ? sigmaPath : pathName === 'rugs' ? rugsPath : '';

  const createPSBT = async (transactionDetail: TransactionData) => {
    const toSignInputsForUnisat = [];
    const toSignInputsForXverse = {
      [connectedAddress]: [],
      [connectedTaprootAddress]: [],
    };
    let totalInputValue = 0;
    let totalOutputValue = 0;
    let fromRuneAmount = bigInt(0);
    let totalRuneAmount = bigInt(0);
    let inscription_utxo: InscriptionUtxoDetail;

    const connectedOrdAddress =
      connectedWallet === 'unisat' ? connectedAddress : connectedTaprootAddress;
    const connectedOrdPubkey =
      connectedWallet === 'unisat' ? connectedPubkey : connectedTaprootPubkey;

    const inscriptionUTXO = await openAPI.getInscriptionUtxoDetail(
      transactionDetail.inscriptionId
    );

    if (inscriptionUTXO?.utxo) {
      inscription_utxo = {
        pubkey: connectedOrdPubkey,
        atomicals: [],
        runes: [],
        satoshis: inscriptionUTXO.utxo.satoshi,
        txid: inscriptionUTXO.utxo.txid,
        vout: inscriptionUTXO.utxo.vout,
        scriptPk: inscriptionUTXO.utxo.scriptPk,
        addressType: getAddressType(connectedOrdAddress),
        address: connectedOrdAddress,
        inscriptions:
          inscriptionUTXO.utxo.inscriptions.length > 0
            ? [
                {
                  ...inscriptionUTXO.utxo.inscriptions[0],
                  id: inscriptionUTXO.utxo.inscriptions[0].inscriptionId,
                },
              ]
            : [],
      };
    } else {
      throw new Error('Invalid inscriptionId');
    }

    let multiple = false;
    if (inscription_utxo.inscriptions.length > 1) {
      multiple = true;
      return;
    }

    if (multiple) {
      throw new Error(
        'Multiple inscriptions are mixed together. Please split them first.'
      );
    }

    const btc_utxos = await openAPI.getAddressUtxo(connectedAddress);
    const sorted_btc_utxos = btc_utxos.sort((a, b) => b?.satoshi - a?.satoshi);

    let feeSum = 0;
    const maximum_fee = 20000;
    const btc_utxos_with_atomical = [];

    for (let v of sorted_btc_utxos) {
      if (feeSum >= maximum_fee) {
        break;
      }

      feeSum += v.satoshi;
      btc_utxos_with_atomical.push({
        txid: v.txid,
        vout: v.vout,
        satoshis: v.satoshi,
        scriptPk: v.scriptPk,
        addressType: getAddressType(v.address),
        address: v.address,
        atomicals: [],
        runes: [],
        pubkey: connectedPubkey,
        inscriptions:
          v.inscriptions.length > 0
            ? [
                {
                  ...v.inscriptions[0],
                  id: v.inscriptions[0].inscriptionId,
                },
              ]
            : [],
      });
    }

    const rune_utxos = await openAPI.getRunesUTXOs(
      connectedOrdAddress,
      transactionDetail.runeId
    );

    if (rune_utxos.length == 0) {
      throw new Error('Insufficient Runes balance');
    }

    const sortedRunesUtXOs = rune_utxos
      .map((v) => {
        return {
          txid: v.txid,
          vout: v.vout,
          satoshis: v.satoshi,
          scriptPk: v.scriptPk,
          addressType: getAddressType(connectedOrdAddress),
          address: connectedOrdAddress,
          pubkey: connectedOrdPubkey,
          inscriptions: v?.inscriptions,
          atomicals: [],
          runes: v?.runes,
        };
      })
      .sort((a, b) => b?.runes[0].amount - a?.runes[0].amount);

    //add runes input and output
    totalRuneAmount = bigInt(Math.floor(transactionDetail.runesAmount))

    let shouldStop = false;
    let inputs = [];
    let outputs = [];

    //add inscription output and input
    inputs.push(utxoToInput(inscription_utxo, false));

    if (connectedWallet === 'unisat') {
      toSignInputsForUnisat.push({
        index: 0,
        publicKey: inscription_utxo.pubkey,
      });
    } else {
      toSignInputsForXverse[connectedTaprootAddress].push(0);
    }

    sortedRunesUtXOs.forEach(function (v, index) {
      if (shouldStop) return;

      if (v?.runes) {
        const isStaked = stakedRunesInfo.stakedUtxos.filter(
          (i) => `${v.txid}:${v.vout}` === i.location
        );
        if (isStaked.length === 0) {
          inputs.push(utxoToInput(v, false));
          if (connectedWallet === 'unisat') {
            toSignInputsForUnisat.push({
              index: index + 1,
              publicKey: v.pubkey,
            });
          } else {
            toSignInputsForXverse[connectedTaprootAddress].push(index + 1);
          }
          totalInputValue += v.satoshis;

          v?.runes.forEach((w: any) => {
            if (w.runeid === transactionDetail.runeId) {
              fromRuneAmount = fromRuneAmount.plus(bigInt(w.amount));
              if (fromRuneAmount.gt(totalRuneAmount)) {
                shouldStop = true; // Set shouldStop to true to indicate to stop looping
              }
            }
          });
        }
      }
    });

    const changedRuneAmount = fromRuneAmount.minus(
      bigInt(Math.floor(Number(totalRuneAmount)))
    );

    const RUNEID = new RuneId(
      new U64(BigInt(Number(transactionDetail.runeId.split(':')[0]))),
      new U32(BigInt(Number(transactionDetail.runeId.split(':')[1])))
    );

    const edicts = [];

    edicts.push({
      id: RUNEID,
      amount: new U128(BigInt(Math.floor(Number(totalRuneAmount)))),
      output: new U32(BigInt(1)),
    });

    if (changedRuneAmount.gt(0)) {
      const edit = {
        id: RUNEID,
        amount: new U128(BigInt(Math.floor(Number(changedRuneAmount)))),
        output: new U32(BigInt(2)),
      };
      edicts.push(edit);
    }

    const runestone = new Runestone({
      edicts: edicts,
    });

    const buffer = runestone.enchiper();

    outputs.push({
      script: bitcoin.script.compile([
        bitcoin.opcodes.OP_RETURN,
        bitcoin.opcodes.OP_13,
        buffer,
      ]),
      value: 0,
    });

    outputs.push({
      address: connectedOrdAddress,
      value: inscription_utxo.satoshis,
    });

    const paddingSignatureLength = toSignInputsForUnisat.length;

    //add btc inputs
    btc_utxos_with_atomical.map((utxo: any, i: number) => {
      totalInputValue += utxo.satoshis;
      inputs.push(utxoToInput(utxo, false));
      if (connectedWallet === 'unisat') {
        toSignInputsForUnisat.push({
          index: i + paddingSignatureLength,
          publicKey: utxo.pubkey,
        });
      } else {
        toSignInputsForXverse[connectedAddress].push(
          i + toSignInputsForXverse[connectedOrdAddress].length
        );
      }
    });

    if (changedRuneAmount.gt(0)) {
      outputs.push({
        address: connectedOrdAddress,
        value: transactionDetail.outputValue,
      });
    }

    // outputs.push({
    //   address: process.env.TREASURY_ADDRESS,
    //   value: 17000,
    // });
    // totalOutputValue += 17000;

    if (totalInputValue <= totalOutputValue) {
      throw new Error(
        "Your wallet address doesn't have enough funds to stake your Rune token."
      );
    }

    const recommendedFee = await openAPI.getFeeSummary();
    const fee = await calculateFee(
      inputs.length,
      outputs.length + 1,
      recommendedFee
    );

    // const estimatePSBT = await toPsbt(inputs, outputs);

    // const txSize = estimatePSBT.extractTransaction(true).virtualSize();
    // const fee = Math.ceil((txSize + 34) * (recommendedFee + 1));

    const changeValue = totalInputValue - totalOutputValue - fee;

    if (changeValue < 0) {
      throw new Error(
        `Your wallet address doesn't have enough funds to stake your Rune token.
            You have: ${satoshisToBTC(totalInputValue)}
            Required: ${satoshisToBTC(totalInputValue - changeValue)}
            Missing: ${satoshisToBTC(-changeValue)}`
      );
    }

    outputs.push({
      address: connectedAddress,
      value: changeValue,
    });

    const psbt = await toPsbt(inputs, outputs);
    const toSignInputs =
      connectedWallet === 'unisat'
        ? toSignInputsForUnisat
        : toSignInputsForXverse;

    return { psbt, toSignInputs };
  };

  const handleStake = async (stakeAmount: number, fee: number) => {
    try {
      if (connectedAddress && stakeAmount && fee) {
        setLoading(true);
        const transactionDetail: TransactionData = {
          inscriptionId: inscriptionData?.id,
          outputValue: 546,
          runesAmount: stakeAmount,
          runeId: runeData.rune_id,
          divisibility: 0,
          feeRate: fee,
        };

        const { psbt, toSignInputs }: any = await createPSBT(transactionDetail);
        await handleDeposit(psbt, toSignInputs);
        setLoading(false);
      }
    } catch (error) {
      setError(error.toString());
      setLoading(false);
    }
  };

  const handleDeposit = async (psbt, toSignInputs) => {
    try {
      if (connectedWallet === 'unisat') {
        await depositCoinonUnisat(psbt, toSignInputs);
      } else if (connectedWallet === 'xverse') {
        await depositCoinonXverse(psbt, toSignInputs);
      } else if (connectedWallet === 'Magic Eden') {
        await depositCoinMagicEden(psbt, toSignInputs);
      }
    } catch (error) {
      throw Error(error);
    }
  };

  const depositCoinonUnisat = async (psbt, toSignInputs) => {
    try {
      const psbtHex = psbt.toHex();
      let signedPSBTHex = await window.unisat.signPsbt(psbtHex, {
        autoFinalized: true,
        toSignInputs,
      });

      let tx = await window.unisat.pushPsbt(signedPSBTHex);
      setTransactionId(tx);
      setFormIsSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const depositCoinonXverse = async (psbt, toSignInputs) => {
    try {
      const psbtBase64 = psbt.toBase64();

      await signTransaction({
        getProvider: async () => {
          return window.XverseProviders.BitcoinProvider;
        },
        payload: {
          network: {
            type: BitcoinNetworkType.Mainnet,
          },
          psbtBase64: psbtBase64,
          broadcast: true,
          message: "tip the author! Don't worry this will not be broadcasted.",
          inputsToSign: [
            {
              address: connectedAddress,
              signingIndexes: toSignInputs[connectedAddress],
            },
            {
              address: connectedTaprootAddress,
              signingIndexes: toSignInputs[connectedTaprootAddress],
            },
          ],
        },
        onFinish: (response) => {
          console.log(response);
          const tx = response.txId;
          setTransactionId(tx);
          setFormIsSubmitted(true);
        },
        onCancel: () => {
          alert('Request canceled');
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const depositCoinMagicEden = async (psbt, toSignInputs) => {
    try {
      const psbtBase64 = psbt.toBase64();
      console.log('inputs:', toSignInputs);
      console.log('psbt', psbt);
      const magicEdenWalletProvider = compatibleWallets.filter(
        (w) => w.name.toLocaleLowerCase() === 'Magic Eden'.toLocaleLowerCase()
      );

      await signTransaction({
        getProvider: async () => {
          return (
            magicEdenWalletProvider[0] as unknown as WalletWithFeatures<any>
          ).features[SatsConnectNamespace]?.provider;
        },
        payload: {
          network: {
            type: BitcoinNetworkType.Mainnet,
          },
          psbtBase64: psbtBase64,
          broadcast: true,
          message: "tip the author! Don't worry this will not be broadcasted.",
          inputsToSign: [
            {
              address: connectedAddress,
              signingIndexes: toSignInputs[connectedAddress],
            },
            {
              address: connectedTaprootAddress,
              signingIndexes: toSignInputs[connectedTaprootAddress],
            },
          ],
        },
        onFinish: async (response) => {
          const hex = base64ToPsbt(response.psbtBase64);
          const hexResponse = await openAPI.pushTx(hex);
          const tx = hexResponse.txId;
          console.log(hexResponse);
          setTransactionId(tx);
          setFormIsSubmitted(true);
        },
        onCancel: () => {
          alert('Request canceled');
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="max-w-[138px]">
          <Image
            src={imagePath}
            width={135}
            height={135}
            alt={inscriptionData?.meta.name}
            onClick={() => fetchfees()}
            className="cursor-pointer box-border hover:box-border hover:border hover:border-[#FFE297] hover:border-1"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[665px]">
        <div className="flex grid grid-cols-2 gap-x-6 gap-y-2">
          <div className="">
            <div className="flex justify-between">
              <span>{inscriptionData?.meta.name}</span>
              <Link
                href={ordinalPath}
                target="_blank"
                className="cursor-pointer"
              >
                <span className="lowercase hover:text-[#FFE297]">
                  {`${inscriptionData?.id.slice(
                    0,
                    5
                  )}...${inscriptionData?.id.slice(-5)}`}
                </span>
              </Link>
            </div>
          </div>
          <div className="">
            <DialogClose>
              <span className="fixed top-10 right-0 pr-10  hover:text-[#FFE297]">{`<ESC>`}</span>
            </DialogClose>
          </div>
          <div className="">
            <Image
              src={imagePath}
              width={240}
              height={240}
              className="w-full"
              alt={inscriptionData?.meta.name}
            />
          </div>
          <div className="">
            <div className="flex h-full flex-col justify-between">
              {formIsSubmitted ? (
                <StakingScreen transactionId={transactionId} />
              ) : (
                <UserForm
                  stakedRunesInfo={stakedRunesInfo}
                  fees={fees}
                  handleStake={handleStake}
                  loading={loading}
                  inscriptionData={inscriptionData}
                />
              )}
            </div>
          </div>
          <div className="">
            <div className="">
              <CurrentStaked
                inscriptionId={inscriptionData?.id}
                currentStake={runeBalance}
              />
            </div>
          </div>
        </div>
        {error && (
          <div className="border-[1px] border-red-500/50 bg-red-600/5 p-2 text-sm">
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RuneDailog;
