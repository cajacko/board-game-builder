import React from "react";
import styled from "styled-components";
import { Props } from "../../types";
import PokerCardHex, { height } from "../../PokerCardHex";

const Title = styled.span<{ villain: boolean }>`
  width: 36mm;
  height: 7mm;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5mm;
  margin-bottom: 16mm;
  position: relative;
  z-index: 4;
  border-radius: 1.5mm;
  border: 0.4mm solid ${({ villain }) => (villain ? "#EF5350" : "#b3b3b3")};
  box-sizing: border-box;
`;

const dotSize = 3;
const borderSize = 1.6;

const Dot = styled.div<{ color: string }>`
  border-radius: 100%;
  height: ${dotSize}mm;
  width: ${dotSize}mm;
  margin: 0 0.8mm -${borderSize / 2}mm;
  box-sizing: border-box;
  background-color: ${({ color }) => color};
  box-shadow: 0 0 0.1mm 0.4mm #ffffff;
`;

const DotContainer = styled.div<{ borderColor: string }>`
  display: flex;
  flex-direction: row;
  border-bottom: ${borderSize}mm solid ${({ borderColor }) => borderColor};
  flex: 1;
  justify-content: center;
`;

const Content = styled.div`
  position: relative;
`;

const Target = styled.span<{ villain: boolean }>`
  height: 10mm;
  width: 10mm;
  display: flex;
  border-radius: 100%;
  background-color: ${({ villain }) => (villain ? "#EF5350" : "#546e7a")};
  color: white;
  box-sizing: border-box;
  font-size: 6mm;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
`;

const Values = styled.div`
  position: absolute;
  top: 5.5mm;
  z-index: 3;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

const valueMargin = 1.5;

const Value = styled.span`
  height: 7mm;
  width: 7mm;
  display: flex;
  border-radius: 100%;
  background-color: #d0d0d0;
  box-sizing: border-box;
  font-size: 4mm;
  align-items: center;
  position: relative;
  justify-content: center;
  z-index: 1;
`;

const VictoryContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -24mm;
  width: 100%;
`;

const Victory = styled.span`
  height: 10mm;
  width: 16mm;
  z-index: 5;
  font-family: "serif";
  font-size: 20mm;
`;

const TitleContainer = styled.div`
  position: relative;
`;

function SideProps(props: { value: number; borderColor: string }) {
  const arr = [];

  for (var i = 0; i < props.value; i += 1) {
    arr.push(i);
  }

  let color: string;

  switch (props.value) {
    case 6:
      color = "#009688";
      break;
    case 5:
      color = "#66BB6A";
      break;
    case 4:
      color = "#D4E157";
      break;
    case 3:
      color = "#FFEE58";
      break;
    case 2:
      color = "#FFA726";
      break;
    case 1:
      color = "#EF5350";
      break;
    default:
      break;
  }

  return (
    <DotContainer borderColor={props.borderColor}>
      {arr.map((key) => (
        <Dot key={key} color={color} />
      ))}
    </DotContainer>
  );
}

const sideStyle: React.CSSProperties = {
  alignItems: "flex-end",
};

function Card(props: Props) {
  const [id, crimeLevel, isVillainCrime, rotations, experience, thwart, chaos] =
    props.columns;

  let borderColor: string;

  switch (crimeLevel) {
    case 1:
      borderColor = "#009688";
      break;
    case 2:
      borderColor = "#D4E157";
      break;
    case 3:
      borderColor = "#FFA726";
      break;
    default:
      break;
  }

  if (isVillainCrime) {
    borderColor = "#EF5350";
  }

  const backgroundImage = isVillainCrime
    ? "https://comicvine.gamespot.com/a/uploads/scale_medium/12/124259/7538232-three-jokers-1-cvr-fnl-1583776056592.jpg"
    : "https://i.pinimg.com/originals/3f/0d/c4/3f0dc4de7bb092bd33965cd1a3f45b6a.jpg	";
  const title = `Crime #${id}`;

  return (
    <PokerCardHex>
      {({ Side }) => (
        <>
          <Side
            side={1}
            style={{
              width: `${height}mm`,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              bottom: "5mm",
              right: "-5mm",
              opacity: 0.3,
            }}
          />
          <Side
            side={1}
            style={{ alignItems: "flex-end", justifyContent: "center" }}
          >
            <Content>
              <TitleContainer>
                {isVillainCrime && (
                  <VictoryContainer>
                    <Victory>V</Victory>
                  </VictoryContainer>
                )}
                <Title villain={!!isVillainCrime}>
                  {title || "Crime Title"}
                </Title>
              </TitleContainer>
              <Values>
                <Value
                  style={{
                    marginRight: `-${valueMargin}mm`,
                    backgroundColor: "#80DEEA",
                  }}
                >
                  {experience}
                </Value>
                <Target villain={false}>{thwart}</Target>
                <Value
                  style={{
                    marginLeft: `-${valueMargin}mm`,
                    backgroundColor: "#EF5350",
                    opacity: typeof chaos !== "number" ? 0 : 1,
                  }}
                >
                  {chaos}
                </Value>
              </Values>
              <Values style={{ zIndex: 5 }}>
                <Target villain={false}>{thwart}</Target>
              </Values>
            </Content>
          </Side>

          {Array.apply(null, Array(6)).map((_, i) => (
            <Side key={i} side={i + 1} style={sideStyle}>
              <SideProps
                value={typeof rotations === "number" ? rotations - i : 0}
                borderColor={borderColor}
              />
            </Side>
          ))}
        </>
      )}
    </PokerCardHex>
  );
}

// 6
// [0,1,2,3,4,5]
// [6,5,4,3,2,1]
// 5
// [5,4,3,2,1,null]
// 4
// [4,3,2,1,null,null]

export default {
  component: Card,
  expectedColumnOrder: [
    "ID",
    "Level",
    "Is villain crime",
    "Rotations",
    "Experience",
    "Thwart",
    "Chaos",
  ],
};
