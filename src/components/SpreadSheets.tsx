import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom";
import { spreadsheetsSelector } from "../store/spreadsheets/selectors";
import actions from "../store/actions";
import IconButton from "./IconButton";

const Container = styled.div`
  padding: 20px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const Spreadsheet = styled.button`
  appearance: none;
  border: 0;
  padding: 0;
  background-color: transparent;
  cursor: pointer;
  text-decoration: underline;
  width: 200px;
  text-align: left;
`;

const Form = styled.form`
  display: flex;
  margin-top: 20px;

  * {
    margin-right: 20px;
  }
`;

const Add = styled.div`
  display: flex;
  align-items: flex-end;
`;

function SpreadSheets() {
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
    <Container>
      <Typography variant="h5" component="h2">
        Spreadsheets
      </Typography>
      {spreadsheets.length !== 0 && (
        <ul>
          {spreadsheets.map(spreadsheet => (
            <li key={spreadsheet.title}>
              <ListItem>
                <Spreadsheet
                  onClick={e => {
                    e.preventDefault();
                    history.push(`/spreadsheet/${spreadsheet.title}`);
                  }}
                >
                  <Typography>{spreadsheet.title}</Typography>
                </Spreadsheet>
                <IconButton
                  onClick={() =>
                    dispatch(
                      actions.spreadsheets.removeSpreadsheet({
                        title: spreadsheet.title
                      })
                    )
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            </li>
          ))}
        </ul>
      )}
      {spreadsheets.length === 0 && <div>No Spreadsheets</div>}

      <Typography variant="h6" component="h2">
        Add a Spreadsheet
      </Typography>
      <Form noValidate autoComplete="off" onSubmit={onSubmit}>
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
        <Add>
          <IconButton onClick={onSubmit}>
            <AddIcon />
          </IconButton>
        </Add>
      </Form>
    </Container>
  );
}

export default SpreadSheets;
