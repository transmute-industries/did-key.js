import React from "react";
import { TransmuteLoading } from "./TransmuteLoading";

export default {
  title: "Transmute Loading",
  component: TransmuteLoading,
};

export const Example = () => {
  return (
    <div>
      <TransmuteLoading
        message={"Loading vaults...."}
      />
    </div>
  );
};
