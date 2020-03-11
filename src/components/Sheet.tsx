import React from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useRouteMatch, useHistory } from "react-router-dom";
import { sheetSelector } from "../store/spreadsheets/selectors";
import { filterRows } from "../store/spreadsheets/selectors";
import useFetchSpreadSheet from "../hooks/useFetchSpreadSheet";
import Table from "./Table";
import Design from "./Design";
import actions from "../store/actions";
import component from "../designs/Card";
import NoPrint from "../components/NoPrint";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));

function Sheet() {
  const match = useRouteMatch<{
    spreadsheetId: string;
    sheetId: string;
    sheetView: "table" | "design";
  }>();
  const spreadsheetId = match.params.spreadsheetId;
  const sheet = useSelector(state => sheetSelector(state, match));
  const status = useFetchSpreadSheet();
  const filterInUse = sheet?.filter || null;
  const [filter, setFilter] = React.useState(filterInUse || "");
  const dispatch = useDispatch();
  const history = useHistory();

  const classes = useStyles();

  const applyFilter = () => {
    if (!sheet) return;
    if (!spreadsheetId) return;

    dispatch(
      actions.spreadsheets.setFilter({
        filter,
        sheetTitle: sheet.title,
        spreadsheetTitle: spreadsheetId
      })
    );
  };

  const rows = sheet ? filterRows(sheet, filterInUse || "") : { rows: [] };
  const isTable = match.params.sheetView === "table";

  return (
    <>
      <NoPrint>
        <p>SpreadSheet {status}</p>
        <button
          onClick={() =>
            history.push(
              `/spreadsheet/${match.params.spreadsheetId}/sheet/${
                match.params.sheetId
              }/${isTable ? "design" : "table"}`
            )
          }
        >
          {isTable ? "Show Design" : "Show Table"}
        </button>
      </NoPrint>

      {sheet && (
        <>
          <NoPrint>
            <p>
              Filter by typing stuff like: "data['Column 1 Heading'] > 3 &&
              !!data['Column 2 Heading']"
            </p>
            <form
              className={classes.root}
              noValidate
              autoComplete="off"
              onSubmit={applyFilter}
            >
              <TextField
                id="filter"
                label="Filter"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <Button variant="contained" onClick={applyFilter}>
                Save
              </Button>
            </form>
            <p>{sheet.title}</p>
          </NoPrint>

          {isTable ? (
            <Table rows={rows.rows} headings={sheet.headings} />
          ) : (
            <Design
              rows={rows.rows}
              headings={sheet.headings}
              component={component}
            />
          )}
        </>
      )}
    </>
  );
}

export default Sheet;
