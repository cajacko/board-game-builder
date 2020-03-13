import React from "react";
import styled from "styled-components";
import { Props } from "../types";
import PokerCard from "../PokerCard";

export const Container = styled.div`
  background-color: #a8f2ff;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 5mm;
  text-align: center;
  justify-content: space-evenly;
  font-family: Chalkboard;
`;

export const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.span`
  margin-bottom: 2mm;
  font-size: 4mm;
`;

export const Text = styled.span`
  font-size: 6mm;
  font-weight: bold;
`;

function Card(props: Props) {
  return (
    <PokerCard>
      <Container>
        <Block>
          <Label>Success Reaction</Label>
          <Text>{props.columns[0]}</Text>
        </Block>
        <Block>
          <Label>Success Reaction</Label>
          <Text>{props.columns[1]}</Text>
        </Block>
      </Container>
    </PokerCard>
  );
}

export default Card;
