import React from "react";
import { useSelector } from "react-redux";

interface Props {
  children: React.ReactNode | ((isPrintWindow: boolean) => React.ReactNode);
}

export function useIsPrintWindow() {
  const isPrintWindow = useSelector(({ isPrintWindow }) => isPrintWindow);

  return isPrintWindow;
}

const NoPrint: React.FC<Props> = ({ children }: Props) => {
  const isPrintWindow = useIsPrintWindow();

  if (typeof children === "function") return children(isPrintWindow);

  if (isPrintWindow) return null;

  return children;
};

export default NoPrint;
