import React from "react";
import styled from "styled-components";
import { Props } from "../types";

const Container = styled.div`
  font-size: 40px;
  width: 300px;
  text-align: center;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
  color: white;
  font-weight: bold;
  letter-spacing: 0.01em;
`;

function ClingyPenguin(props: Props) {
  return <Container>{props.columns[0]}</Container>;
}

export default {
  component: ClingyPenguin,
  expectedColumnOrder: ["Text"],
};
