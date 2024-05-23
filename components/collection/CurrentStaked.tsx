import React, { useEffect, useState } from "react";
import openAPI from "@/services/openAPI";

interface PageProps {
  inscriptionId: string;
}

const CurrentStaked = ({ inscriptionId }: PageProps) => {
  const [currentStaked, setCurrentStaked] = useState("");

  useEffect(() => {
    // const getCurrentStaking = async () => {
    //   //   const res = await openAPI.getInscriptionUtxoDetail(inscriptionId);
    //   const res = await fetch(
    //     "https://ordinals.com/content/c33de8908d4fc828f761306daf7586c611c8fa9620848605e421113bc48ad032i0"
    //   );
    //   console.log(res);
    // };
    // getCurrentStaking();
  }, []);

  return <div className="">Currently staked: {currentStaked}</div>;
};

export default CurrentStaked;
