import React from "react";
import times from "lodash/times";
import styled from "styled-components";
import CasinoIcon from "@material-ui/icons/Casino";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import AttachMoneyIcon from "@material-ui/icons/Security";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faTimes,
  faFistRaised,
  faRunning,
  faCogs,
  faMeteor,
} from "@fortawesome/free-solid-svg-icons";
import { Props } from "../../types";
import PokerCard from "../../PokerCard";
import {
  TitleBar,
  Title,
  shadow,
  ContainerForSidebar,
  Sidebar,
  SidebarItem,
  titleBarHeight,
} from "./Styles";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffffb8;
`;

const ID = styled.div`
  font-size: 3mm;
`;

const EffectChargeCost = styled.div`
  position: absolute;
  top: -3mm;
  right: 1mm;
`;

const effectHorizontalMargin = 2;

const Effect = styled.div`
  background-color: #fffffff0;
  position: absolute;
  bottom: 14mm;
  left: ${effectHorizontalMargin + 13}mm;
  right: ${effectHorizontalMargin}mm;
  top: 52mm;
  font-size: 3.5mm;
  padding: 5mm;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-align: center;
  ${shadow}
`;

const Categories = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const categoryStyle: React.CSSProperties = {
  marginRight: "2.5mm",
  fontSize: "4mm",
};

const Footer = styled.div`
  font-size: 3mm;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #eceff1;
  padding: 1.5mm 3mm;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  z-index: 2;
  height: 8mm;
  ${shadow};
`;

const levelSize = (titleBarHeight * 9) / 4;
const levelPosition = -levelSize / 3;

const Level = styled.span<{ $isGadget?: boolean }>`
  position: absolute;
  top: ${levelPosition}mm;
  left: ${levelPosition}mm;
  height: ${levelSize}mm;
  width: ${levelSize}mm;
  background-color: ${({ $isGadget }) => ($isGadget ? "#fbcccc" : "#bce0ff")};
  color: black;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding-bottom: 5.5mm;
  padding-right: 6.5mm;
  border-radius: 50%;
  box-shadow: 0px 0px 2mm black;
  box-sizing: border-box;
`;

function Icons({
  icon: Icon,
  count,
  getStyle,
  horizontal,
}: {
  horizontal?: boolean;
  icon: typeof FlashOnIcon;
  count: number;
  getStyle: (index: number) => React.CSSProperties;
}) {
  return (
    <>
      {times<React.ReactNode>(count, (index) => (
        <Icon key={`${index}`} fontSize="small" style={getStyle(index)} />
      ))}
    </>
  );
}

function withGetChargeCostIconStyle(props: {
  count: number;
  offsetX: number;
  offsetY: number;
  style?: React.CSSProperties;
}) {
  return (index: number): React.CSSProperties => {
    return {
      marginLeft: index > 0 ? -props.offsetX : undefined,
      marginTop: index > 0 ? props.offsetY * index : undefined,
      ...props.style,
    };
  };
}

function withGetSideBarIconStyle(props: {
  count: number;
  offsetX: number;
  offsetY: number;
  style?: React.CSSProperties;
}) {
  return (index: number): React.CSSProperties => {
    return {
      ...props.style,
      marginBottom: "1.5mm",
    };
  };
}

function Card(props: Props) {
  const [
    id,
    type,
    level,
    cardName,
    effect,
    cardCost,
    chargeCost,
    isStrength,
    isSpeed,
    isMystic,
    isTechnology,
    thwart,
    movement,
    charge,
  ] = props.columns;

  let effectTop = 52;

  if (typeof effect === "string") {
    if (effect.length > 200) {
      effectTop = 30;
    } else if (effect.length > 150) {
      effectTop = 36;
    } else if (effect.length > 125) {
      effectTop = 41;
    } else if (effect.length > 100) {
      effectTop = 46;
    } else if (effect.length > 80) {
      effectTop = 50;
    }
  }

  return (
    <PokerCard>
      <Wrapper
        style={{
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundImage:
            "url('https://previews.123rf.com/images/sergeypykhonin/sergeypykhonin1801/sergeypykhonin180100118/94341416-fist-punching-or-strong-punch-drawn-in-pop-art-retro-comic-style-cartoon-vector-illustration.jpg')",
        }}
      >
        <Overlay />
        <TitleBar $hasTitle={!!cardName}>
          {typeof level === "number" && (
            <Level $isGadget={type === "Gadget"}>
              {level}
              <div style={{ fontSize: "4mm" }}>
                {type === "Gadget" ? "g" : "a"}
              </div>
            </Level>
          )}
          {cardName && <Title style={{ marginLeft: "17mm" }}>{cardName}</Title>}
        </TitleBar>
        <ContainerForSidebar>
          <Sidebar>
            <SidebarItem>
              <Icons
                icon={CasinoIcon}
                getStyle={withGetSideBarIconStyle({
                  count: typeof thwart === "number" ? thwart : 0,
                  offsetX: 11,
                  offsetY: 10,
                })}
                count={typeof thwart === "number" ? thwart : 0}
              />
              <Icons
                icon={ControlCameraIcon}
                getStyle={withGetSideBarIconStyle({
                  count: typeof movement === "number" ? movement : 0,
                  offsetX: 10,
                  offsetY: 10,
                })}
                count={typeof movement === "number" ? movement : 0}
              />
              <Icons
                icon={FlashOnIcon}
                getStyle={withGetSideBarIconStyle({
                  count: typeof charge === "number" ? charge : 0,
                  offsetX: 11,
                  offsetY: 11,
                })}
                count={typeof charge === "number" ? charge : 0}
              />
            </SidebarItem>
          </Sidebar>

          {effect && effect !== "N/A" && (
            <Effect style={{ top: `${effectTop}mm` }}>
              {effect}
              {typeof chargeCost === "number" && (
                <EffectChargeCost>
                  <Icons
                    horizontal
                    icon={FlashOnIcon}
                    getStyle={withGetChargeCostIconStyle({
                      count: chargeCost,
                      offsetX: 7,
                      offsetY: 0,
                      style: {
                        fontSize: "7mm",
                      },
                    })}
                    count={chargeCost}
                  />
                </EffectChargeCost>
              )}
            </Effect>
          )}

          <Footer>
            <Categories>
              {isStrength === true && (
                <FontAwesomeIcon icon={faFistRaised} style={categoryStyle} />
              )}
              {isSpeed === true && (
                <FontAwesomeIcon icon={faRunning} style={categoryStyle} />
              )}
              {isTechnology === true && (
                <FontAwesomeIcon icon={faCogs} style={categoryStyle} />
              )}
              {isMystic === true && (
                <FontAwesomeIcon icon={faMeteor} style={categoryStyle} />
              )}
            </Categories>
            <ID>#{id}</ID>
            <ID style={{ color: type === "Gadget" ? "red" : "blue" }}>
              {typeof cardCost === "number"
                ? `${cardCost} ${
                    type === "Gadget" ? "resources 📦" : "experience"
                  }`
                : ""}
            </ID>
          </Footer>
        </ContainerForSidebar>
      </Wrapper>
    </PokerCard>
  );
}

export default {
  component: Card,
  expectedColumnOrder: [
    "ID",
    "Type",
    "Level",
    "Card name",
    "Effect",
    "Card cost",
    "Charge cost",
    "Is strength type",
    "Is speed type",
    "Is mystic type",
    "Is technology type",
    "Thwart",
    "Movement",
    "Charge",
  ],
};
