import { NextResponse, NextRequest } from "next/server";
import { Rune } from "@/types";
import { PartnerCollections } from "@/data/collections";
// import { Transaction } from "@unisat/wallet-sdk/lib/transaction";

export const GET = async (req: NextRequest, { params }: any) => {
  const address = params.address;
  try {
    const response = await fetch(
      `https://wallet-api.unisat.io/v5/runes/list?address=${address}&cursor=0&size=100`
      // {
      //   headers: {
      //     "x-api-key": process.env.API_KEY as string,
      //   },
      // }
    );

    // console.log(Transaction);
    const jsonRes = await response.json();
    const runeList = jsonRes?.data.list.length ? jsonRes.data.list : null;

    const rune = runeList.filter((runes: any) => PartnerCollections.some(collection => collection.rune_id === runes.runeid) );

    if(rune.length) {
      return NextResponse.json(rune[0], { status: 200 });
    } else {
      return NextResponse.json(null, { status: 200 });
    }

    // const sigmaXRune = runeList.filter(
    //   (r: Rune) => r.runeid === process.env.RUNE_ID
    // );

    // const data = sigmaXRune.length ? sigmaXRune[0] : null;
    const data = runeList[0];

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error Getting Inscriptions" },
      { status: 500 }
    );
  }
};
