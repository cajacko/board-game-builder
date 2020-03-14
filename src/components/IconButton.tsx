import React from "react";
import styled from "styled-components";

const Button = styled.button`
  appearance: none;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  :hover {
    opacity: 0.5;
  }
`;

interface IProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const IconButton: React.FC<IProps> = ({ children, onClick }) => (
  <Button
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </Button>
);

export default IconButton;
