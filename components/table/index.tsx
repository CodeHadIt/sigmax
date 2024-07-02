'use client'
import React from "react";
import TableHeaderComp from "./header";
import DesktopTable from "./desktoptable";
import MobileTable from "./mobiletable";
import { useMediaQuery } from "react-responsive";

const CollectionsTable = () => {

  const isLargeScreens = useMediaQuery({ query: "(min-width: 768px)" });

  return (
    <div>
      <TableHeaderComp />
      {isLargeScreens ? <DesktopTable /> : <MobileTable />}
    </div>
  );
};

export default CollectionsTable;
