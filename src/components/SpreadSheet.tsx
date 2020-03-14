import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import { sheetsSelector } from "../store/spreadsheets/selectors";
import useFetchSpreadSheet from "../hooks/useFetchSpreadSheet";
import Status from "./Status";

const Container = styled.div`
  padding: 20px;
  position: relative;
`;

const Sheet = styled.button`
  appearance: none;
  border: 0;
  padding: 0;
  background-color: transparent;
  cursor: pointer;
  text-decoration: underline;
  width: 200px;
  text-align: left;
`;

function SpreadSheet() {
  const match = useRouteMatch<{ spreadsheetId: string }>();
  const sheets = useSelector(state => sheetsSelector(state, match));
  const status = useFetchSpreadSheet();
  const history = useHistory();

  return (
    <Container>
      <Typography variant="h5" component="h2">
        Sheets
      </Typography>
      <Status status={status} />

      <ul>
        {sheets &&
          sheets.map(title => (
            <li key={title}>
              <Sheet
                onClick={() =>
                  history.push(
                    `/spreadsheet/${match.params.spreadsheetId}/sheet/${title}/table`
                  )
                }
              >
                <Typography>{title}</Typography>
              </Sheet>
            </li>
          ))}
      </ul>
    </Container>
  );
}

export default SpreadSheet;
