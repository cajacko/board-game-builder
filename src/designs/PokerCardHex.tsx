import React from "react";
import styled from "styled-components";
import { width } from "./PokerCard";

const hexWidth = 200;
const hexHeight = 400;
const hexMargin1 = 80;
const hexMargin4 = 20;

const ratio = width / hexWidth;

export const height = 73.4;
export { width };
export const sideWidth = 36.7;

const Container = styled.div`
  width: ${width}mm;
  height: ${height}mm;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
`;

const Inner = styled.div`
  position: relative;
  left: -${hexMargin4 * ratio}mm;
  top: -1.4mm;
`;

const Hex1 = styled.div`
  overflow: hidden;
  visibility: hidden;
  transform: rotate(120deg);
  cursor: pointer;
  width: ${width}mm;
  height: ${hexHeight * ratio}mm;
  margin: -${hexMargin1 * ratio}mm 0 0 ${hexMargin4 * ratio}mm;
`;

const HexIn1 = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  transform: rotate(-60deg);
`;

const HexIn2 = styled.div`
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  visibility: visible;
  transform: rotate(-60deg);
`;

const Content = styled.div`
  width: ${width}mm;
  height: ${height}mm;
  position: relative;
  top: 26.7mm;
`;

function getDeg(props: { side: number }) {
  switch (props.side) {
    case 2:
      return -90;
    case 3:
      return -150;
    case 6:
      return 30;
    case 5:
      return 90;
    case 4:
      return 150;
    default:
      return -30;
  }
}

const SideContainer = styled.div<{ side: number }>`
  position: absolute;
  display: flex;
  height: ${width}mm;
  width: ${sideWidth}mm;
  bottom: 4.8mm;
  right: 13.4mm;
  transform: rotate(${getDeg}deg);
`;

function Side(props: {
  side: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <SideContainer side={props.side} {...props}>
      {props.children}
    </SideContainer>
  );
}

type RenderProp = (props: { Side: typeof Side }) => React.ReactNode;

interface Props {
  children: React.ReactNode | RenderProp;
}

function PokerCardSquare(props: Props) {
  return (
    <Container>
      <Inner>
        <Hex1>
          <HexIn1>
            <HexIn2>
              <Content>
                {typeof props.children === "function"
                  ? props.children({ Side })
                  : props.children}
              </Content>
            </HexIn2>
          </HexIn1>
        </Hex1>
      </Inner>
    </Container>
  );
}

export default PokerCardSquare;
