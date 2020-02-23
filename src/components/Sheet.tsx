import React from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { sheetSelector } from "../store/activeSpreadSheet/selectors";
import { filterRows } from "../store/spreadsheets/selectors";
import useFetchSpreadSheet from "../hooks/useFetchSpreadSheet";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import actions from "../store/actions";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));

function Sheet() {
  const sheet = useSelector(sheetSelector);
  const spreadsheetTitle = useSelector(state => state.activeSpreadSheet?.title);
  const status = useFetchSpreadSheet();
  const [filter, setFilter] = React.useState("");
  const dispatch = useDispatch();
  const filterInUse = sheet?.filter || null;

  const classes = useStyles();

  const applyFilter = () => {
    if (!sheet) return;
    if (!spreadsheetTitle) return;

    dispatch(
      actions.spreadsheets.setFilter({
        filter,
        sheetTitle: sheet.title,
        spreadsheetTitle
      })
    );
  };

  return (
    <div>
      <p>SpreadSheet {status}</p>
      {sheet && (
        <>
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
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {sheet.headings.map((value, i) => (
                    <TableCell key={i}>{value}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filterRows(sheet, filterInUse || "").rows.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((value, j) => (
                      <TableCell key={j}>
                        {value !== (null || undefined) && `${value}`}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}

export default Sheet;
