import { Decimal } from "decimal.js";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
bitcoin.initEccLib(ecc);

export enum AddressType {
  P2TR,
  P2PKH,
  P2WPKH,
  P2SH_P2WPKH,
  M44_P2WPKH,
  M44_P2TR,
}

export function addressFormat(address: string, length: number): string {
  try {
    if (address) {
      const formattedAddress =
        address.slice(0, length) + "..." + address.slice(-length);
      return formattedAddress;
    }
    return "";
  } catch (error) {
    return "";
  }
}

export const hex2Text = (hex: string): string => {
  try {
    return hex.startsWith("0x")
      ? decodeURIComponent(
          hex.replace(/^0x/, "").replace(/[0-9a-f]{2}/g, "%$&")
        )
      : hex;
  } catch {
    return hex;
  }
};

export const satoshisToBTC = (amount: number): number => {
  return amount / 100000000;
};

export const btcTosatoshis = (amount: number): number => {
  return Math.floor(amount * 100000000);
};

export function shortAddress(address?: string, len: number = 5): string {
  if (!address) return "";
  if (address.length <= len * 2) return address;
  return address.slice(0, len) + "..." + address.slice(address.length - len);
}

export async function sleep(timeSec: number): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, timeSec * 1000);
  });
}

export const copyToClipboard = (textToCopy: string | number): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(textToCopy.toString());
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy.toString();
    textArea.style.position = "absolute";
    textArea.style.opacity = "0";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise<void>((res, rej) => {
      document.execCommand("copy")
        ? res()
        : rej(new Error("Copy command failed"));
      textArea.remove();
    });
  }
};

export const calculateFee = (
  vins: number,
  vouts: number,
  recommendedFeeRate: number
): number => {
  const baseTxSize = 10;
  const inSize = 50;
  const outSize = 30;

  const txSize = baseTxSize + vins * inSize + vouts * outSize + outSize; // Adjusted formula to account for all outputs
  const fee = txSize * recommendedFeeRate;
  return Number(fee.toFixed(0));
};

export function getAddressType(address: string | null): AddressType | null {
  if (!address) {
    return null;
  }

  // Check for P2PKH (Mainnet: '1', Testnet: 'm' or 'n')
  if (
    (address[0] === "1" || address[0] === "m" || address[0] === "n") &&
    address.length >= 26 &&
    address.length <= 35
  ) {
    return AddressType.P2PKH;
  }

  // Check for P2SH (Mainnet: '3', Testnet: '2')
  if (
    (address[0] === "3" || address[0] === "2") &&
    address.length >= 26 &&
    address.length <= 35
  ) {
    return AddressType.P2SH_P2WPKH;
  }

  // Check for Bech32 (Mainnet: 'bc1', Testnet: 'tb1')
  if (address.startsWith("bc1") || address.startsWith("tb1")) {
    try {
      // P2WPKH (Bech32 addresses starting with 'bc1q' or 'tb1q')
      if (address.startsWith("bc1q") || address.startsWith("tb1q")) {
        return AddressType.P2WPKH;
      }
      // P2TR (Bech32m addresses starting with 'bc1p' or 'tb1p')
      else if (address.startsWith("bc1p") || address.startsWith("tb1p")) {
        return AddressType.P2TR;
      }
    } catch (e) {
      console.error(e);
      return null; // Invalid Bech32 address
    }
  }

  // Unknown or unsupported address type
  return null;
}

export function fromDecimalAmount(
  decimalAmount: string,
  divisibility: number
): string {
  // Ensure that there is no trailing dot
  decimalAmount = decimalAmount.replace(/\.$/, "");

  // If divisibility is 0, return the amount without any change
  if (divisibility === 0) {
    return decimalAmount;
  }

  // Convert the amount to a Decimal and scale it by 10^divisibility
  const amount = new Decimal(decimalAmount).times(
    new Decimal(10).pow(divisibility)
  );
  return amount.toString();
}

export const toXOnly = (pubKey) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

export function utxoToInput(utxo: any, estimate: any) {
  if (
    utxo.addressType === AddressType.P2TR ||
    utxo.addressType === AddressType.M44_P2TR
  ) {
    const data = {
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.satoshis,
        script: Buffer.from(utxo.scriptPk, "hex"),
      },
      tapInternalKey: toXOnly(Buffer.from(utxo.pubkey, "hex")),
    };
    return {
      data,
      utxo,
    };
  } else if (
    utxo.addressType === AddressType.P2WPKH ||
    utxo.addressType === AddressType.M44_P2WPKH
  ) {
    const data = {
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.satoshis,
        script: Buffer.from(utxo.scriptPk, "hex"),
      },
    };
    return {
      data,
      utxo,
    };
  } else if (utxo.addressType === AddressType.P2PKH) {
    if (!utxo.rawtx || estimate) {
      const data = {
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          value: utxo.satoshis,
          script: Buffer.from(utxo.scriptPk, "hex"),
        },
      };
      return {
        data,
        utxo,
      };
    } else {
      const data = {
        hash: utxo.txid,
        index: utxo.vout,
        nonWitnessUtxo: Buffer.from(utxo.rawtx, "hex"),
      };
      return {
        data,
        utxo,
      };
    }
  } else if (utxo.addressType === AddressType.P2SH_P2WPKH) {
    const redeemData = bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(utxo.pubkey, "hex"),
    });
    const data = {
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        value: utxo.satoshis,
        script: Buffer.from(utxo.scriptPk, "hex"),
      },
      redeemScript: redeemData.output,
    };
    return {
      data,
      utxo,
    };
  }
}

export function toPsbt(inputs, outputs) {
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin });
  inputs.forEach((v, index) => {
    if (v.utxo.addressType === AddressType.P2PKH) {
      if (v.data.witnessUtxo) {
        //@ts-ignore
        psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = true;
      }
    }
    psbt.data.addInput(v.data);
    psbt.setInputSequence(index, 0xfffffffd);
  });
  outputs.forEach((v) => {
    if (v.address) {
      psbt.addOutput({
        address: v.address,
        value: v.value,
      });
    } else if (v.script) {
      psbt.addOutput({
        script: v.script,
        value: v.value,
      });
    }
  });
  return psbt;
}
