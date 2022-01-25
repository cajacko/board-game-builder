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
  top: -8mm;
  width: 100%;
`;

const Victory = styled.img`
  height: 10mm;
  width: 10mm;
  z-index: 5;
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
    case 1:
      color = "#009688";
      break;
    case 2:
      color = "#66BB6A";
      break;
    case 3:
      color = "#D4E157";
      break;
    case 4:
      color = "#FFEE58";
      break;
    case 5:
      color = "#FFA726";
      break;
    case 6:
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
  const [
    title,
    backgroundImage,
    thwartTarget,
    crimeLevel,
    exp,
    threat,
    hasVictoryPoint,
    villain,
  ] = props.columns;

  let borderColor: string;

  switch (crimeLevel) {
    case "Starter":
      borderColor = "#009688";
      break;
    case 1:
      borderColor = "#66BB6A";
      break;
    case 2:
      borderColor = "#D4E157";
      break;
    case 3:
      borderColor = "#FFEE58";
      break;
    case 4:
      borderColor = "#FFA726";
      break;
    case "Villain":
      borderColor = "#EF5350";
      break;
    default:
      break;
  }

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
            }}
          />
          <Side
            side={1}
            style={{ alignItems: "flex-end", justifyContent: "center" }}
          >
            <Content>
              <TitleContainer>
                {hasVictoryPoint && (
                  <VictoryContainer>
                    <Victory src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Star_icon_stylized.svg/1024px-Star_icon_stylized.svg.png" />
                  </VictoryContainer>
                )}
                <Title villain={!!villain}>{title || "Crime Title"}</Title>
              </TitleContainer>
              <Values>
                <Value
                  style={{
                    marginRight: `-${valueMargin}mm`,
                    backgroundColor: "#80DEEA",
                  }}
                >
                  {exp}
                </Value>
                <Target villain={!!villain}>{thwartTarget}</Target>
                <Value
                  style={{
                    marginLeft: `-${valueMargin}mm`,
                    backgroundColor: "#EF5350",
                    opacity: typeof threat !== "number" ? 0 : 1,
                  }}
                >
                  {threat}
                </Value>
              </Values>
              <Values style={{ zIndex: 5 }}>
                <Target villain={!!villain}>{thwartTarget}</Target>
              </Values>
            </Content>
          </Side>

          <Side side={1} style={sideStyle}>
            <SideProps value={1} borderColor={borderColor} />
          </Side>
          <Side side={2} style={sideStyle}>
            <SideProps value={2} borderColor={borderColor} />
          </Side>
          <Side side={3} style={sideStyle}>
            <SideProps value={3} borderColor={borderColor} />
          </Side>
          <Side side={4} style={sideStyle}>
            <SideProps value={4} borderColor={borderColor} />
          </Side>
          <Side side={5} style={sideStyle}>
            <SideProps value={5} borderColor={borderColor} />
          </Side>
          <Side side={6} style={sideStyle}>
            <SideProps value={6} borderColor={borderColor} />
          </Side>
        </>
      )}
    </PokerCardHex>
  );
}

export default {
  component: Card,
  expectedColumnOrder: [
    "Title",
    "Image",
    "Thwart Target",
    "Crime Level",
    "Experience",
    "Threat",
    "Has Victory Points",
    "Is Villain",
  ],
};
