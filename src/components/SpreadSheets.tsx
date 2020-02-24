import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { spreadsheetsSelector } from "../store/spreadsheets/selectors";
import actions from "../store/actions";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));

function SpreadSheets() {
  const classes = useStyles();
  const spreadsheets = useSelector(spreadsheetsSelector);
  const dispatch = useDispatch();
  const [title, setTitle] = React.useState("");
  const [id, setId] = React.useState("");
  const history = useHistory();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(actions.spreadsheets.addSpreadsheet({ id, title }));
    setTitle("");
    setId("");
  };

  return (
    <>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="spreadsheet-title"
          label="Spreadsheet Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <TextField
          id="spreadsheet-id"
          label="Spreadsheet ID"
          value={id}
          onChange={e => setId(e.target.value)}
        />
        <Button variant="contained" onClick={onSubmit}>
          Save
        </Button>
      </form>

      {spreadsheets.length !== 0 && (
        <ul className={classes.root}>
          {spreadsheets.map(spreadsheet => (
            <li key={spreadsheet.title}>
              <button
                onClick={() =>
                  history.push(`/spreadsheet/${spreadsheet.title}`)
                }
              >
                {spreadsheet.title}
              </button>
              <Button
                variant="contained"
                onClick={() =>
                  dispatch(
                    actions.spreadsheets.removeSpreadsheet({
                      title: spreadsheet.title
                    })
                  )
                }
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
      {spreadsheets.length === 0 && <div>No Spreadsheets</div>}
    </>
  );
}

export default SpreadSheets;
