import React from "react";
import styled from "styled-components";
import { Props } from "../types";
import PokerCard from "../PokerCard";
import { Container, Block, Label as PersonalityLabel } from "./Personality";

export const Label = styled(PersonalityLabel)`
  font-weight: bold;
`;

export const Text = styled.span`
  font-size: 3mm;
`;

function RoomCardBack(props: Props) {
  const [
    ,
    successHealth,
    successRestriction,
    failHealth,
    failRestriction,
    critHealth,
    critRestriction,
    isExitCard
  ] = props.columns;

  const restrictionText =
    "The Next Active Player must draw a Restriction Card. ";
  const moveOnText = "Move on.";

  const successText = isExitCard
    ? "Congratulations, you have escaped the mad house!"
    : `${successHealth ? `+${successHealth} health. ` : ""}${
        successRestriction ? restrictionText : ""
      }${moveOnText}`;

  const failText = `${failHealth ? `-${failHealth} health. ` : ""}${
    failRestriction ? restrictionText : ""
  }${moveOnText}`;

  const critText = `${critHealth ? `-${critHealth} health. ` : ""}${
    critRestriction ? restrictionText : ""
  }${moveOnText}`;

  return (
    <PokerCard>
      <Container
        style={{ backgroundColor: isExitCard ? "#FFA8A8" : "#C7FFA8" }}
      >
        <Block>
          <Label>Success</Label>
          <Text>{successText}</Text>
        </Block>
        <Block>
          <Label>Failure</Label>
          <Text>{failText}</Text>
        </Block>
        <Block>
          <Label>Critical Failure</Label>
          <Text>{critText}</Text>
        </Block>
      </Container>
    </PokerCard>
  );
}

export default {
  component: RoomCardBack,
  expectedColumnOrder: [
    "*",
    "successHealth",
    "successRestriction",
    "failHealth",
    "failRestriction",
    "critHealth",
    "critRestriction",
    "isExitCard"
  ]
};
