import React from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useRouteMatch, useHistory } from "react-router-dom";
import get from "lodash/get";
import { sheetSelector } from "../store/spreadsheets/selectors";
import { filterRows } from "../store/spreadsheets/selectors";
import { ExtendedSheet } from "../store/spreadsheets/types";
import useFetchSpreadSheet from "../hooks/useFetchSpreadSheet";
import Table from "./Table";
import Design from "./Design";
import actions from "../store/actions";
import designs, { Designs, DesignComponent } from "../designs";
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
  const sheet = useSelector(state =>
    sheetSelector(state, match)
  ) as ExtendedSheet | null;
  const status = useFetchSpreadSheet();
  const filterInUse = sheet?.filter || null;
  const [filter, setFilter] = React.useState(filterInUse || "");
  const dispatch = useDispatch();
  const history = useHistory();

  const classes = useStyles();

  const applyDesign = (design: string) => () => {
    if (!sheet) return;
    if (!spreadsheetId) return;

    dispatch(
      actions.spreadsheets.setDesign({
        component: design,
        sheetTitle: sheet.title,
        spreadsheetTitle: spreadsheetId
      })
    );
  };

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

  let component: null | DesignComponent = null;

  if (sheet && sheet.designMap) {
    const parts = sheet.designMap.component.split(".");
    const design = get(designs, parts, null) as DesignComponent | undefined;

    if (typeof design === "function") {
      component = design;
    }
  }

  const components: string[] = [];

  const loop = (items: Designs, parent?: string) => {
    Object.keys(items).forEach(key => {
      const nextParent = parent ? `${parent}.${key}` : key;
      const design = items[key];

      if (typeof design === "function") {
        components.push(nextParent);
      } else {
        loop(design, nextParent);
      }
    });
  };

  loop(designs);

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
        Components:
        {components.map(text => (
          <button key={text} onClick={applyDesign(text)}>
            {text}
          </button>
        ))}
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
