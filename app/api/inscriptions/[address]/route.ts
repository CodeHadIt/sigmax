import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { PartnerCollections } from "@/data/collections";

export const GET = async (req: NextRequest, { params }: any) => {
  const address = params.address;
  
  const headersList = headers();
  const referer = headersList.get("referer");
  let pathname : string;

  if (referer) {
    const request = new NextRequest(referer);
    pathname = request.nextUrl.pathname.replace("/", "");
  }

  const currentCollection = PartnerCollections.filter((collection: any) => collection.slug === pathname)[0];

  const collectionSymbol = currentCollection.collection_symbol;

  try {
    const response = await fetch(
      `https://api-mainnet.magiceden.dev/v2/ord/btc/tokens?limit=100&collectionSymbol=${collectionSymbol}&ownerAddress=${address}`,
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
