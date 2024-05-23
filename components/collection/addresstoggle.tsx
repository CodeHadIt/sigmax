
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";
import React, { useContext, useState } from "react";


const AddressToggle = () => {

  const { connectedAddress, setConnectedAddress } = useContext(
    WalletConnectContext
  ) as WalletContextInterface;

  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <DropdownMenu
      open={openDropdown}
      onOpenChange={() => setOpenDropdown(false)}
    >
      <DropdownMenuTrigger onMouseEnter={() => setOpenDropdown(true)} asChild>
        <p className="lowercase text-base">{`<${
          connectedAddress?.slice(0, 5) + "..." + connectedAddress?.slice(-5)
        }>`}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onMouseLeave={() => setOpenDropdown(false)}
        className="bg-[#222222] cursor-pointer rounded-none text-white border-[#222222] hover:border hover:border-[#FFE297] hover:border-1"
      >
        <DropdownMenuItem
          onClick={() => setConnectedAddress(null)}
          className="cursor-pointer"
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddressToggle;
