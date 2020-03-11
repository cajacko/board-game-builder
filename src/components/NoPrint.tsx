import React from "react";
import { useSelector } from "react-redux";

interface Props {
  children: any;
}

const NoPrint: React.FC<Props> = ({ children }: Props) => {
  const isPrintWindow = useSelector(({ isPrintWindow }) => isPrintWindow);

  if (isPrintWindow) return null;

  return children;
};

export default NoPrint;
