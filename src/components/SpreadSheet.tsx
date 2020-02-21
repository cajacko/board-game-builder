import React from "react";
import { useSelector } from "react-redux";
import { activeSpreadsheetSelector } from "../store/activeSpreadSheet/selectors";

function SpreadSheet() {
  const [status, setStatus] = React.useState("Fetching");
  const spreadsheet = useSelector(state => activeSpreadsheetSelector(state));
  const apiKey = useSelector(state => state.googleApiKey);

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
        console.log(res);

        if (res && res.error) {
          throw new Error("Error from server");
        }

        setStatus("Success");
      })
      .catch(e => {
        console.error(e);
        setStatus("Error");
      });
  }, [apiKey, spreadsheet]);

  return <div>SpreadSheet {status}</div>;
}

export default SpreadSheet;
