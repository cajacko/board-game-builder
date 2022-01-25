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

const ID = styled.div`
  font-size: 3mm;
`;

const Categories = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
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
  align-items: space-between;
  z-index: 2;
  height: 8mm;
  ${shadow};
`;

const levelSize = (titleBarHeight * 8) / 4;
const levelPosition = -levelSize / 3;

const Level = styled.span`
  position: absolute;
  top: ${levelPosition}mm;
  left: ${levelPosition}mm;
  height: ${levelSize}mm;
  width: ${levelSize}mm;
  background-color: white;
  color: black;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding-bottom: 4mm;
  padding-right: 5.5mm;
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
    hasWritten,
    type,
    level,
    cardName,
    effect,
    chargeCost,
    isStrength,
    isSpeed,
    isMystic,
    isTechnology,
    thwart,
    movement,
    charge,
  ] = props.columns;

  return (
    <PokerCard>
      <Wrapper>
        <TitleBar>
          {typeof level === "number" && (
            <Level>
              {level}
              <div style={{ fontSize: "3mm" }}>
                {type === "Gadget" ? "g" : "a"}
              </div>
            </Level>
          )}
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
    "Have written",
    "Type",
    "Level",
    "Card name",
    "Effect",
    "Charge cost",
    "Is strength type",
    "Is speed type",
    "Is mystic type",
    "Is technology type",
    "Thwart",
    "Movement",
    "Charge",
    "Props ID",
  ],
};
