import React from "react";
import styled from "styled-components";
import times from "lodash/times";
import { Props } from "./types";
import PokerCardSquare from "./PokerCardSquare";

const border = "0.3mm solid black";
const contentPadding = 2;
const headerHeight = 10;
const footerHeight = 10;

const Header = styled.div`
  border-bottom: ${border};
  height: ${headerHeight}mm;
  box-sizing: border-box;
  background-color: #c5d4d8;
  display: flex;
`;

const Content = styled.div<{ height: number }>`
  box-sizing: border-box;
  padding: ${contentPadding * 2}mm;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  flex: 1;
`;

const Footer = styled.div`
  border-top: ${border};
  padding: ${contentPadding}mm;
  height: ${footerHeight}mm;
  box-sizing: border-box;
  background-color: #9aaeb3;
  display: flex;
`;

const Charge = styled.div`
  border-left: ${border};
  padding: ${contentPadding}mm;
  height: ${headerHeight}mm;
  box-sizing: border-box;
`;

const Title = styled.div`
  padding: ${contentPadding}mm;
  flex: 1;
`;

const ChargeImage = styled.img<{ noMargin: boolean }>`
  height: 4.5mm;
  transform: rotate(-24deg);
  margin-left: ${({ noMargin }) => (noMargin ? "0" : "-1mm")};
  float: right;
`;

const CoinImage = styled.img`
  height: 4.5mm;
  margin-right: 2mm;
  float: left;
`;

function Card(props: Props) {
  const chargeCost: React.ReactNode[] = [];
  const gadgetCost: React.ReactNode[] = [];

  const chargeCostValue =
    typeof props.headings["Charge Cost"] === "number"
      ? props.headings["Charge Cost"]
      : 0;

  const gadgetCostValue =
    typeof props.headings["Gadget Cost"] === "number"
      ? props.headings["Gadget Cost"]
      : 0;

  times(chargeCostValue, i =>
    chargeCost.push(
      <ChargeImage
        key={i}
        src="https://svgsilh.com/svg/1295307.svg"
        noMargin={i === chargeCostValue - 1}
      />
    )
  );

  times(gadgetCostValue, i =>
    gadgetCost.push(
      <CoinImage
        key={i}
        src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Gold_coin_icon.png"
      />
    )
  );

  return (
    <PokerCardSquare>
      {({ height }) => (
        <>
          <Header>
            <Title>{props.headings["Title"] || "Placeholder"}</Title>
            {!!chargeCost.length && <Charge>{chargeCost}</Charge>}
          </Header>
          <Content height={height}>
            <span>{props.headings["Effect"] || "No Effect"}</span>
          </Content>
          {!!gadgetCost && <Footer>{gadgetCost}</Footer>}
        </>
      )}
    </PokerCardSquare>
  );
}

export default Card;
