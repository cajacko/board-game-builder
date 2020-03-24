import React from "react";
import styled from "styled-components";
import CasinoIcon from "@material-ui/icons/Casino";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { Props } from "../types";
import PokerCard from "../PokerCard";
import {
  TitleBar,
  Title,
  shadow,
  ContainerForSidebar,
  Sidebar,
  SidebarItem,
  sidebarIconStyle
} from "./Styles";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
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
        <TitleBar>
          <Title>{title}</Title>
        </TitleBar>
        <ContainerForSidebar style={{ backgroundImage: `url(${image})` }}>
          <Sidebar>
            <SidebarItem hide={!thwart}>
              <CasinoIcon style={sidebarIconStyle} />
              {thwart}
            </SidebarItem>
            <SidebarItem hide={!movement}>
              <ControlCameraIcon style={sidebarIconStyle} />
              <span style={{ opacity: 0 }}>0</span>
            </SidebarItem>
            <SidebarItem hide={!resources}>
              <AttachMoneyIcon style={sidebarIconStyle} />
              {resources}
            </SidebarItem>
            <SidebarItem hide={!energy}>
              <FlashOnIcon style={sidebarIconStyle} />
              {energy}
            </SidebarItem>
          </Sidebar>
          {set && (
            <Set>
              {set} x3 = {setPower}
            </Set>
          )}
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
    "Thwart",
    "Movement",
    "Resources",
    "Energy",
    "Set",
    "Set Power"
  ]
};
