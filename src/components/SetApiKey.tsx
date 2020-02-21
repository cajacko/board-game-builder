import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import actions from "../store/actions";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));

function SetApiKey() {
  const savedKey = useSelector(state => state.googleApiKey);
  const [apiKey, setApiKey] = React.useState(savedKey || "");
  const dispatch = useDispatch();
  const classes = useStyles();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(actions.apiKey.setApiKey({ apiKey }));
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
          id="api-key"
          label="Google API Key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
        />
        <Button variant="contained" onClick={onSubmit}>
          Save
        </Button>
      </form>
    </>
  );
}

export default SetApiKey;
