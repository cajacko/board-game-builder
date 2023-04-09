import React from "react";
import styled from "styled-components";
import { Props } from "../types";

const Container = styled.div<{ $type: "center" | "left" | "right" }>`
  font-size: 26px;
  width: 200px;
  text-align: ${(props) => props.$type};
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.$type === "center"
      ? "center"
      : props.$type === "left"
      ? "flex-start"
      : "flex-end"};
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
  color: white;
  font-weight: bold;
  letter-spacing: 0.055em;
`;

function withClingyPenguin(type: "center" | "left" | "right") {
  return (props: Props) => {
    return <Container $type={type}>{props.columns[0]}</Container>;
  };
}

export const center = {
  component: withClingyPenguin("center"),
  expectedColumnOrder: ["Text"],
};

export const left = {
  ...center,
  component: withClingyPenguin("left"),
};

export const right = {
  ...center,
  component: withClingyPenguin("right"),
};
