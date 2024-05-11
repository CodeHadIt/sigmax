'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WalletConnectContext } from "@/contexts/WalletConnectContext";
import { WalletContextInterface } from "@/types/wallets";
import { useContext, useState } from "react";


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
        <p className="lowercase text-xl">{`<${
          connectedAddress?.slice(0, 5) + "..." + connectedAddress?.slice(-5)
        }>`}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onMouseLeave={() => setOpenDropdown(false)}
        className="bg-[#222222] cursor-pointer rounded-none border-none text-white button-hover"
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
