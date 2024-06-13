import { NextResponse, NextRequest } from "next/server";
import { Rune } from "@/types";
import { headers } from "next/headers";
import { PartnerCollections } from "@/data/collections";
// import { Transaction } from "@unisat/wallet-sdk/lib/transaction";

export const GET = async (req: NextRequest, { params }: any) => {
  const address = params.address;

  let pathname: string;
  const headersList = headers();
  const referer = headersList.get("referer");
  if (referer) {
    const request = new NextRequest(referer);
    pathname = request.nextUrl.pathname.replace("/", "");
  }

  const currentCollection = PartnerCollections.filter(
    (collection: any) => collection.slug === pathname
  )[0];

  const runeSelected = currentCollection.rune_fullname;

  console.log(runeSelected, process.env.API_KEY, address);

  try {
    const response = await fetch(
      `https://api-mainnet.magiceden.dev/v2/ord/btc/runes/utxos/wallet/${address}?rune=${runeSelected}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}` as string,
        },
      }
    );

    const jsonRes = await response.json();

    // const runeList = jsonRes?.data.list.length ? jsonRes.data.list : null;

    // const rune = runeList.filter((runes: any) => PartnerCollections.some(collection => collection.rune_id === runes.runeid) );

    // if(rune.length) {
    //   return NextResponse.json(rune[0], { status: 200 });
    // } else {
    //   return NextResponse.json(null, { status: 200 });
    // }

    // const sigmaXRune = runeList.filter(
    //   (r: Rune) => r.runeid === process.env.RUNE_ID
    // );

    // const data = sigmaXRune.length ? sigmaXRune[0] : null;

    // const data = runeList[0];

    return NextResponse.json(
      { ...currentCollection, utxos: jsonRes.utxos },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error Getting Inscriptions" },
      { status: 500 }
    );
  }
};
