import Image from "next/image";
import React from "react";

export const AppLogo = ({ size = 40 }: { size?: number }) => (
  <Image src="/logo.png" alt="App Logo" width={size} height={size} priority />
);
