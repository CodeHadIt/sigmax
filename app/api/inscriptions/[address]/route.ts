import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { PartnerCollections } from "@/data/collections";

export const GET = async (req: NextRequest, { params }: any) => {
  const address = params.address;

  const headersList = headers();
  const referer = headersList.get("referer");
  let pathname: string;

  if (referer) {
    const request = new NextRequest(referer);
    pathname = request.nextUrl.pathname.replace("/", "");
  }

  const currentCollection = PartnerCollections.filter((collection: any) => collection.slug === pathname)[0];

  const collectionSymbol = currentCollection.collection_symbol;

  const fetchTokens = async (offset = 0) => {
    try {
      const response = await fetch(
        `https://api-mainnet.magiceden.dev/v2/ord/btc/tokens?limit=100&collectionSymbol=${collectionSymbol}&ownerAddress=${address}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}` as string,
          },
        }
      );
      const data = await response.json();
      return data.tokens;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  let allTokens: any[] = [];
  let offset = 0;
  let moreTokens = true;

  while (moreTokens) {
    const tokens = await fetchTokens(offset);
    if (!tokens) {
      return NextResponse.json(
        { message: "Error Getting Inscriptions" },
        { status: 500 }
      );
    }
    allTokens = allTokens.concat(tokens);
    if (tokens.length < 100) {
      moreTokens = false;
    } else {
      offset += 100;
    }
  }

  return NextResponse.json({ tokens: allTokens }, { status: 200 });
};
