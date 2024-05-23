
import React, { useState } from 'react'
import WalletConnectDialog from './walletconnectdialog';

const DialogWrapper = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(true);

  return (
    <div>
      <WalletConnectDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </div>
  );
}

export default DialogWrapper