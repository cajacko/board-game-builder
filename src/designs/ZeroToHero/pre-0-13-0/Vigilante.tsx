import React from "react";
import styled from "styled-components";
import PanToolIcon from "@material-ui/icons/PanTool";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import BuildIcon from "@material-ui/icons/Build";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import { Props, DesignComponent } from "../../types";
import PokerCard from "../../PokerCard";
import {
  TitleBar,
  Title,
  ContainerForSidebar,
  Sidebar,
  SidebarItem,
  shadow,
  sidebarIconStyle,
} from "./Styles";

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

const Level = styled.span`
  position: absolute;
  bottom: -6mm;
  right: -6mm;
  background-color: #eceff1;
  border-radius: 100%;
  height: 17mm;
  width: 17mm;
  ${shadow};
  box-sizing: border-box;
  padding-top: 3mm;
  padding-right: 5mm;
  text-align: center;
`;

const options = ["1", "2", "3a", "3b"];

function Card(props: Props) {
  const level = props.option || options[0];

  let title: any;
  let backgroundImage: any;
  let handSize: any;
  let movement: any;
  let trade: any;
  let research: any;
  let upgrade: any;
  let text: any;

  switch (level) {
    case "2":
      title = props.columns[24];
      backgroundImage = props.columns[25];
      text = props.columns[6];
      handSize = props.columns[7];
      movement = props.columns[8];
      trade = props.columns[9];
      research = props.columns[10];
      upgrade = props.columns[11];
      break;
    case "3a":
      title = props.columns[26];
      backgroundImage = props.columns[27];
      text = props.columns[12];
      handSize = props.columns[13];
      movement = props.columns[14];
      trade = props.columns[15];
      research = props.columns[16];
      break;
    case "3b":
      title = props.columns[28];
      backgroundImage = props.columns[29];
      text = props.columns[17];
      handSize = props.columns[18];
      movement = props.columns[19];
      trade = props.columns[20];
      research = props.columns[21];
      break;
    default:
      title = props.columns[22];
      backgroundImage = props.columns[23];
      text = props.columns[0];
      handSize = props.columns[1];
      movement = props.columns[2];
      trade = props.columns[3];
      research = props.columns[4];
      upgrade = props.columns[5];
      break;
  }

  return (
    <PokerCard>
      <Wrapper>
        <TitleBar>
          <Title>{title}</Title>
        </TitleBar>
        <ContainerForSidebar
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <Sidebar>
            <SidebarItem>
              <PanToolIcon style={sidebarIconStyle} />
              {handSize}
            </SidebarItem>
            <SidebarItem>
              <ControlCameraIcon style={sidebarIconStyle} />
              {movement}
            </SidebarItem>
            <SidebarItem>
              <SyncAltIcon style={sidebarIconStyle} />
              {trade}
            </SidebarItem>
            <SidebarItem>
              <BuildIcon style={sidebarIconStyle} />
              {research}
            </SidebarItem>
            {upgrade && (
              <SidebarItem>
                <ArrowUpwardIcon style={sidebarIconStyle} />
                {upgrade}
              </SidebarItem>
            )}
          </Sidebar>
          <TextContainer>
            <Text>{text}</Text>
          </TextContainer>
          <Level>{level}</Level>
        </ContainerForSidebar>
      </Wrapper>
    </PokerCard>
  );
}

const designComponent: DesignComponent = {
  component: Card,
  options,
  expectedColumnOrder: [
    "Level 1 Effect",
    "Level 1 Hand Size",
    "Level 1 Movement",
    "Level 1 Trade Cost",
    "Level 1 Research Cost",
    "Level 1 Upgrade Cost",
    "Level 2 Effect",
    "Level 2 Hand Size",
    "Level 2 Movement",
    "Level 2 Trade Cost",
    "Level 2 Research Cost",
    "Level 2 Upgrade Cost",
    "Level 3a Effect",
    "Level 3a Hand Size",
    "Level 3a Movement",
    "Level 3a Trade Cost",
    "Level 3a Research Cost",
    "Level 3b Effect",
    "Level 3b Hand Size",
    "Level 3b Movement",
    "Level 3b Trade Cost",
    "Level 3b Research Cost",
    "Level 1 Title",
    "Level 1 Image",
    "Level 2 Title",
    "Level 2 Image",
    "Level 3a Title",
    "Level 3a Image",
    "Level 3b Title",
    "Level 3b Image",
  ],
};

export default designComponent;
