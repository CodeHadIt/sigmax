import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: any) => {
  const address = params.address;
  try {
    const response = await fetch(
      `https://api.bestinslot.xyz/v3/wallet/inscriptions?address=${address}&sort_by=inscr_num&order=desc&offset=0&count=2000&exclude_brc20=true&cursed_only=false`,
      {
        headers: {
          "x-api-key": process.env.API_KEY as string,
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
