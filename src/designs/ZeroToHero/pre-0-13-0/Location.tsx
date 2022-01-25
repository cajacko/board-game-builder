import React from "react";
import styled from "styled-components";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import { Props } from "../../types";
import PokerCard from "../../PokerCard";
import { TitleBar, Title, ContainerForSidebar } from "./Styles";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
`;

const Energy = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin-right: 2mm;
`;

function Card(props: Props) {
  const [ID, location, hasShuffle, image] = props.columns;

  return (
    <PokerCard>
      <Wrapper>
        <TitleBar>
          <Title>
            {ID} - {location}
          </Title>
          <Energy>{hasShuffle && <ShuffleIcon />}</Energy>
        </TitleBar>
        <ContainerForSidebar
          style={{ backgroundImage: `url(${image})` }}
        ></ContainerForSidebar>
      </Wrapper>
    </PokerCard>
  );
}

export default {
  component: Card,
  expectedColumnOrder: ["ID", "Location", "Has Shuffle", "Image"],
};
