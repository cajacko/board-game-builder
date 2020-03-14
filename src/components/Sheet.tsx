import React from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import { useRouteMatch, useHistory } from "react-router-dom";
import get from "lodash/get";
import Typography from "@material-ui/core/Typography";
import { sheetSelector } from "../store/spreadsheets/selectors";
import { filterRows } from "../store/spreadsheets/selectors";
import { ExtendedSheet } from "../store/spreadsheets/types";
import SaveIcon from "@material-ui/icons/Save";
import ChangeIcon from "@material-ui/icons/Sync";
import useFetchSpreadSheet from "../hooks/useFetchSpreadSheet";
import Table from "./Table";
import Design from "./Design";
import actions from "../store/actions";
import designs, { Designs, DesignComponent } from "../designs";
import NoPrint from "../components/NoPrint";
import Status from "./Status";
import IconButton from "./IconButton";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "0px",
    bottom: "0px",
    height: 500
  }
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const ComponentTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ComponentButton = styled.button`
  appearance: none;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  margin-bottom: 10px;

  :hover {
    opacity: 0.5;
    text-decoration: underline;
  }
`;

const Container = styled.div<{ hasPadding: boolean }>`
  padding: ${({ hasPadding }) => (hasPadding ? "20px" : "0")};
  position: relative;
`;

const Filter = styled.form`
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
`;

const Switch = styled.button`
  appearance: none;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  margin-bottom: 10px;

  :hover {
    opacity: 0.5;
    text-decoration: underline;
  }
`;

function Sheet() {
  const match = useRouteMatch<{
    spreadsheetId: string;
    sheetId: string;
    sheetView: "table" | "design";
  }>();
  const spreadsheetId = match.params.spreadsheetId;
  const isPrintWindow = useSelector(({ isPrintWindow }) => isPrintWindow);
  const sheet = useSelector(state =>
    sheetSelector(state, match)
  ) as ExtendedSheet | null;
  const status = useFetchSpreadSheet();
  const filterInUse = sheet?.filter || null;
  const [filter, setFilter] = React.useState(filterInUse || "");
  const dispatch = useDispatch();
  const history = useHistory();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const applyDesign = (design: string) => () => {
    if (!sheet) return;
    if (!spreadsheetId) return;

    setOpen(false);

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

  const componentName = sheet && sheet.designMap && sheet.designMap.component;

  if (componentName) {
    const parts = componentName.split(".");
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
    <Container hasPadding={!isPrintWindow}>
      <NoPrint>
        <Typography variant="h5" component="h2">
          Sheet{sheet && ` - ${sheet.title}`} - {isTable ? "Table" : "Design"}
        </Typography>
        <Status status={status} />
        <Switch
          onClick={() =>
            history.push(
              `/spreadsheet/${match.params.spreadsheetId}/sheet/${
                match.params.sheetId
              }/${isTable ? "design" : "table"}`
            )
          }
        >
          <Typography>
            {isTable ? "Switch to Design View" : "Switch to Table View"}
          </Typography>
        </Switch>
      </NoPrint>

      {sheet && (
        <>
          <NoPrint>
            <Typography variant="h6" component="h2">
              Filter
            </Typography>

            <Filter noValidate autoComplete="off" onSubmit={applyFilter}>
              <TextField
                id="filter"
                label="e.g: data['Column 1 Heading'] > 3 && !!data['Column 2 Heading']"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ width: 600 }}
              />
              <IconButton onClick={applyFilter}>
                <SaveIcon />
              </IconButton>
            </Filter>
          </NoPrint>

          {isTable ? (
            <Table rows={rows.rows} headings={sheet.headings} />
          ) : (
            <>
              <NoPrint>
                <ComponentTitle>
                  <Typography variant="h6" component="h2">
                    Component:
                  </Typography>
                  <Typography
                    variant="caption"
                    component="h2"
                    style={{ marginRight: 20, marginLeft: 10, marginTop: 5 }}
                  >
                    {componentName || "No component set"}
                  </Typography>
                  <IconButton onClick={handleOpen}>
                    <ChangeIcon />
                  </IconButton>
                </ComponentTitle>
              </NoPrint>
              <Design
                rows={rows.rows}
                headings={sheet.headings}
                component={component}
              />
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
              >
                <div style={modalStyle} className={classes.paper}>
                  <ul>
                    {components.map(text => (
                      <li key={text}>
                        <ComponentButton onClick={applyDesign(text)}>
                          <Typography>{text}</Typography>
                        </ComponentButton>
                      </li>
                    ))}
                  </ul>
                </div>
              </Modal>
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default Sheet;
