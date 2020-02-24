import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import actions from "../store/actions";
import { activeSpreadsheetSelector } from "../store/spreadsheets/selectors";

function useFetchSpreadSheet() {
  const match = useRouteMatch();
  const [status, setStatus] = React.useState("Fetching");
  const spreadsheet = useSelector(state =>
    activeSpreadsheetSelector(state, match)
  );
  const apiKey = useSelector(state => state.googleApiKey);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!spreadsheet) {
      console.error(new Error("No id"));
      setStatus("Error");
      return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet.id}?includeGridData=true&fields=sheets(data%2FrowData%2Fvalues%2FformattedValue%2Cproperties%2Ftitle)&key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(res => {
        if (res && res.error) throw new Error("Error from server");
        if (!spreadsheet) {
          console.error(new Error("No id"));
          setStatus("Error");
          return;
        }

        dispatch(
          actions.spreadsheets.setSpreadsheetData({
            data: res,
            title: spreadsheet.title
          })
        );

        setStatus("Success");
      })
      .catch(e => {
        console.error(e);
        setStatus("Error");
      });
    // eslint-disable-next-line
  }, []);

  return status;
}

export default useFetchSpreadSheet;
