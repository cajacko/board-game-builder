import React from "react";
import PokerCard, { width, SizeRenderProp } from "./PokerCard";

interface Props {
  children: React.ReactNode | SizeRenderProp;
}

function PokerCardSquare(props: Props) {
  return <PokerCard height={width}>{props.children}</PokerCard>;
}

export default PokerCardSquare;
