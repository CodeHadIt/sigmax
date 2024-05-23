export interface TransactionData {
  inscriptionId?: string;
  outputValue: number;
  runesAmount: number;
  runeId: string;
  divisibility: number;
  feeRate: number;
}

export interface InscriptionUtxoDetail {
  pubkey: string;
  atomicals: any;
  runes: any;
  satoshis: number;
  txid: string;
  vout: number;
  scriptPk: string;
  addressType: any;
  address: string;
  inscriptions: any;
}
