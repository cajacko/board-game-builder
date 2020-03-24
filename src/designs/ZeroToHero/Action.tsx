import React from "react";
import styled from "styled-components";
import { Props } from "../types";
import PokerCard from "../PokerCard";

const shadow = "box-shadow: 0 0 1mm black;";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
`;

const Title = styled.span`
  display: flex;
  height: 14mm;
  background-color: #eceff1;
  align-items: center;
  padding-left: 3mm;
  font-size: 4mm;
  height: 10mm;
  ${shadow};
  position: relative;
  z-index: 2;
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background-size: cover;
  position: relative;
  z-index: 1;
`;

const Icons = styled.div`
  background-color: #eceff1;
  display: flex;
  flex-direction: column;
  ${shadow};
  position: relative;
  z-index: 2;
  margin-top: 5mm;
`;

const Icon = styled.span<{ show: boolean }>`
  display: flex;
  height: 10mm;
  width: 10mm;
  align-items: center;
  justify-content: center;
  opacity: ${({ show }) => (show ? 1 : 0)};
  font-size: 4mm;

  * {
    font-size: 4mm;
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const Set = styled.span`
  font-size: 3mm;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #eceff1;
  padding: 1.5mm 3mm;
  text-align: right;
  ${shadow};
`;

const Movement = styled.img`
  height: 6mm;
  width: 6mm;
`;

const Thwart = styled.div``;

const Resources = styled.img`
  height: 5mm;
  width: 5mm;
  margin-bottom: 2mm;
`;

const Dice = styled.img`
  height: 5mm;
  width: 5mm;
  margin-right: 0.5mm;
`;

function Card(props: Props) {
  const [
    title,
    image,
    thwart,
    movement,
    resources,
    energy,
    set,
    setPower
  ] = props.columns;

  return (
    <PokerCard>
      <Wrapper>
        <Title>{title}</Title>
        <Container style={{ backgroundImage: `url(${image})` }}>
          <Icons>
            <Icon show={!!thwart}>
              <IconContainer>
                <Thwart>
                  <Dice src="https://cdn.onlinewebfonts.com/svg/img_431599.png" />
                  {thwart}
                </Thwart>
              </IconContainer>
            </Icon>
            <Icon show={!!movement}>
              <IconContainer>
                <Movement src="https://static.thenounproject.com/png/66378-200.png" />
              </IconContainer>
            </Icon>
            <Icon show={!!resources}>
              <IconContainer>
                <Resources src="https://www.pngrepo.com/download/144064/money-bag-with-dollar-symbol.png" />
                {resources}
              </IconContainer>
            </Icon>
            <Icon show={!!energy}>
              <IconContainer>
                <Resources src="https://i.ya-webdesign.com/images/energy-icon-png-11.png" />
                {energy}
              </IconContainer>
            </Icon>
          </Icons>
          {set && (
            <Set>
              {set} x3 = {setPower}
            </Set>
          )}
        </Container>
      </Wrapper>
    </PokerCard>
  );
}

export default {
  component: Card,
  expectedColumnOrder: [
    "Title",
    "Image",
    "Thwart",
    "Movement",
    "Resources",
    "Energy",
    "Set",
    "Set Power"
  ]
};
