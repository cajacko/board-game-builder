import React from "react";
import styled from "styled-components";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { Props } from "../../types";
import PokerCardSquare from "../../PokerCardSquare";
import { TitleBar, Title, ContainerForSidebar } from "./Styles";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
`;

const TextContainer = styled.div`
  display: flex;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin: 0 5mm;
`;

const Text = styled.span`
  font-size: 4mm;
  text-align: center;
  padding: 1.3mm 1.6mm;
  background-color: #eceff1db;
`;

const Background = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Energy = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin-right: 2mm;
`;

const Resources = styled.div`
  position: absolute;
  bottom: 2mm;
  left: 2mm;
  display: flex;
  justify-content: flex-start;
`;

const iconStyle = { fontSize: "6mm", margin: "0 -1mm" };

function Card(props: Props) {
  const [title, image, energy, resources, effect, level] = props.columns;

  const energyComponents = [];
  const resourceComponents = [];

  if (energy && typeof energy === "number") {
    for (var i = 0; i < energy; i += 1) {
      energyComponents.push(<FlashOnIcon style={iconStyle} />);
    }
  }

  if (resources && typeof resources === "number") {
    for (var i = 0; i < resources; i += 1) {
      resourceComponents.push(<AttachMoneyIcon style={iconStyle} />);
    }
  }

  let backgroundColor: string;

  switch (level) {
    case "Starter":
      backgroundColor = "#D4E157";
      break;
    case 1:
      backgroundColor = "#FFEE58";
      break;
    case 2:
      backgroundColor = "#FFA726";
      break;
    default:
      backgroundColor = "#EF5350";
      break;
  }

  return (
    <PokerCardSquare>
      {props.option === "Back" ? (
        <Background style={{ backgroundColor }}>{level}</Background>
      ) : (
        <Wrapper>
          <TitleBar>
            <Title>{title}</Title>
            <Energy>{energyComponents}</Energy>
          </TitleBar>
          <ContainerForSidebar style={{ backgroundImage: `url(${image})` }}>
            <TextContainer>
              <Text>{effect}</Text>
            </TextContainer>
            <Resources>{resourceComponents}</Resources>
          </ContainerForSidebar>
        </Wrapper>
      )}
    </PokerCardSquare>
  );
}

export default {
  component: Card,
  options: ["Front", "Back"],
  expectedColumnOrder: [
    "Title",
    "Image",
    "Energy",
    "Resources",
    "Effect",
    "Level",
  ],
};
