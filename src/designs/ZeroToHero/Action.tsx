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
import { Props } from "../types";
import PokerCard from "../PokerCard";
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

const UpgradeCost = styled.div`
  display: flex;
  flex-direction: row;
`;

const UpgradeCostAmount = styled.div`
  font-size: 3.5mm;
  padding-left: 1mm;
`;

const UpgradeType = styled.div`
  font-size: 3.5mm;
  padding-left: 1.5mm;
`;

const EffectChargeCost = styled.div`
  position: absolute;
  top: -3mm;
  right: 1mm;
`;

const effectHorizontalMargin = 7;

const Effect = styled.div`
  background-color: white;
  position: absolute;
  bottom: 14mm;
  left: ${effectHorizontalMargin}mm;
  right: ${effectHorizontalMargin}mm;
  top: 42mm;
  font-size: 3.5mm;
  padding: 5mm;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-align: center;
  ${shadow}
`;

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
  ${shadow};
`;

const levelSize = (titleBarHeight * 7) / 4;
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
      marginLeft: index > 0 ? -props.offsetX : undefined,
      marginTop: index > 0 ? props.offsetY * index : undefined,
      ...props.style,
    };
  };
}

function Card(props: Props) {
  const [
    title,
    image,
    thwart,
    movement,
    defense,
    charge,
    level,
    ability,
    abilityCost,
    upgradeCost,
    hasStrength,
    hasSpeed,
    hasTech,
    hasMystic,
  ] = props.columns;

  return (
    <PokerCard>
      <Wrapper>
        <TitleBar>
          {!!level && <Level>{level}</Level>}
          <Title style={{ marginLeft: "13mm" }}>{title}</Title>
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
            </SidebarItem>
            <SidebarItem>
              <Icons
                icon={ControlCameraIcon}
                getStyle={withGetSideBarIconStyle({
                  count: movement ? 1 : 0,
                  offsetX: 10,
                  offsetY: 10,
                })}
                count={movement ? 1 : 0}
              />
            </SidebarItem>
            <SidebarItem hide={!defense}>
              <Icons
                icon={AttachMoneyIcon}
                getStyle={withGetSideBarIconStyle({
                  count: typeof defense === "number" ? defense : 0,
                  offsetX: 7,
                  offsetY: 10,
                })}
                count={typeof defense === "number" ? defense : 0}
              />
            </SidebarItem>
            <SidebarItem hide={!charge} style={{ paddingBottom: "1mm" }}>
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
          {ability && (
            <Effect>
              {ability}
              {typeof abilityCost === "number" && (
                <EffectChargeCost>
                  <Icons
                    horizontal
                    icon={FlashOnIcon}
                    getStyle={withGetSideBarIconStyle({
                      count: abilityCost,
                      offsetX: 7,
                      offsetY: 0,
                      style: {
                        fontSize: "7mm",
                      },
                    })}
                    count={abilityCost}
                  />
                </EffectChargeCost>
              )}
            </Effect>
          )}
          <Footer>
            <Categories>
              {hasStrength && (
                <FontAwesomeIcon icon={faFistRaised} style={categoryStyle} />
              )}
              {hasSpeed && (
                <FontAwesomeIcon icon={faRunning} style={categoryStyle} />
              )}
              {hasTech && (
                <FontAwesomeIcon icon={faCogs} style={categoryStyle} />
              )}
              {hasMystic && (
                <FontAwesomeIcon icon={faMeteor} style={categoryStyle} />
              )}
            </Categories>
            {!!upgradeCost && (
              <UpgradeCost>
                <ArrowUpward
                  style={{
                    fontSize: "4mm",
                  }}
                />
                <UpgradeCostAmount>{upgradeCost}</UpgradeCostAmount>
                <UpgradeType>
                  {!!abilityCost ? (
                    <FontAwesomeIcon icon={faCubes} />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} />
                  )}
                </UpgradeType>
              </UpgradeCost>
            )}
          </Footer>
        </ContainerForSidebar>
      </Wrapper>
    </PokerCard>
  );
}

export default {
  component: Card,
  expectedColumnOrder: [
    "Title",
    "Image",
    "Thwart Dice",
    "Movement",
    "Defense",
    "Charge",
    "Level",
    "Ability",
    "Ability Charge Cost",
    "Upgrade Cost",
    "Has Strength",
    "Has Speed",
    "Has Tech",
    "Has Mystic",
  ],
};
