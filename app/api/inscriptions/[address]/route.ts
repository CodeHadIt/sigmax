import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  const address = params.address;
  try {
    const response = await fetch(
      `https://api-mainnet.magiceden.dev/v2/ord/btc/tokens?limit=100&collectionSymbol=ordinalsigmax&ownerAddress=${address}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}` as string,
        },
      }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error Getting Inscriptions" },
      { status: 500 }
    );
  }
};
