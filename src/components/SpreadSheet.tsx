import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { sheetsSelector } from "../store/spreadsheets/selectors";
import useFetchSpreadSheet from "../hooks/useFetchSpreadSheet";

function SpreadSheet() {
  const match = useRouteMatch<{ spreadsheetId: string }>();
  const sheets = useSelector(state => sheetsSelector(state, match));
  const status = useFetchSpreadSheet();
  const history = useHistory();

  return (
    <div>
      SpreadSheet {status}
      <ul>
        {sheets &&
          sheets.map(title => (
            <li key={title}>
              <button
                onClick={() =>
                  history.push(
                    `/spreadsheet/${match.params.spreadsheetId}/sheet/${title}`
                  )
                }
              >
                {title}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default SpreadSheet;
