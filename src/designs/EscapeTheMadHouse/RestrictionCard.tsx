import React from "react";
import { Props } from "../types";
import PokerCard from "../PokerCard";
import { Container, Block } from "./Personality";
import { Label, Text } from "./RoomCardBack";

function RestrictionCard(props: Props) {
  return (
    <PokerCard>
      <Container style={{ backgroundColor: "#FCFF7F" }}>
        <Block>
          <Label>Restriction</Label>
          <Text>{props.columns[0]} Then discard this card.</Text>
        </Block>
      </Container>
    </PokerCard>
  );
}

export default {
  component: RestrictionCard,
  expectedColumnOrder: ["Restriction Text"]
};
