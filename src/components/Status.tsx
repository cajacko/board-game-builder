import React from "react";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";

const Container = styled.div`
  padding: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 200px;
  background-color: #cacaca;
  opacity: 0.5;
`;

interface IProps {
  status: "Fetching" | "Error" | "Success";
}

const Status: React.FC<IProps> = ({ status }) => {
  let statusText: string | null = status === "Success" ? null : status;

  if (status === "Error") {
    statusText =
      "Error. Make sure you enabled sharing. File -> Share -> Advanced -> Anyone with Link";
  }

  if (!statusText) return null;

  return (
    <Container>
      <Typography variant="caption">{statusText}</Typography>
    </Container>
  );
};

export default Status;
