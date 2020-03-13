import React from "react";
import styled from "styled-components";

const borderWidth = 0.3;
const border = `${borderWidth}mm dashed #c5c5c5`;

export const height = 88.9;
export const width = 63.5;

const Container = styled.div<{ height: number; width: number }>`
  height: ${props => props.height}mm;
  width: ${props => props.width}mm;
  box-sizing: border-box;
  position: relative;
  margin-right: -${borderWidth}mm;
`;

const Vertical = styled.div`
  position: absolute;
  top: -${borderWidth * 10}mm;
  bottom: -${borderWidth * 10}mm;
  border-left: ${border};
  z-index: 2;
`;

const Horizontal = styled.div`
  position: absolute;
  left: -${borderWidth * 10}mm;
  right: -${borderWidth * 10}mm;
  border-top: ${border};
  z-index: 2;
`;

const Content = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /* overflow: hidden; */
  /* border: ${border}; */
  box-sizing: border-box;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;

export type SizeRenderProp = (size: {
  height: number;
  width: number;
}) => React.ReactNode;

interface Props {
  children: React.ReactNode | SizeRenderProp;
  height?: number;
  width?: number;
}

function PokerCard(props: Props) {
  return (
    <Container height={props.height || height} width={props.width || width}>
      <Vertical style={{ left: 0 }} />
      <Vertical style={{ right: 0 }} />
      <Horizontal style={{ top: 0 }} />
      <Horizontal style={{ bottom: 0 }} />
      <Content>
        {typeof props.children === "function"
          ? props.children({ height, width })
          : props.children}
      </Content>
    </Container>
  );
}

export default PokerCard;
