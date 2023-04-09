import React from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import { useRouteMatch, useHistory } from "react-router-dom";
import get from "lodash/get";
import Typography from "@material-ui/core/Typography";
import { sheetSelector } from "../store/spreadsheets/selectors";
import {
  filterRows,
  rowsWithQuantity,
  rowsWithOption,
} from "../store/spreadsheets/selectors";
import { ExtendedSheet } from "../store/spreadsheets/types";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ChangeIcon from "@material-ui/icons/Sync";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import useFetchSpreadSheet from "../hooks/useFetchSpreadSheet";
import Table from "./Table";
import Design from "./Design";
import actions from "../store/actions";
import designs from "../designs/";
import { Designs, DesignComponent } from "../designs/types";
import NoPrint from "../components/NoPrint";
import Status from "./Status";
import IconButton from "./IconButton";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { join } from "path";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "0px",
    bottom: "0px",
    height: 500,
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflow: "scroll",
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
  const sheet = useSelector((state) =>
    sheetSelector(state, match)
  ) as ExtendedSheet | null;
  const status = useFetchSpreadSheet();
  const filterInUse = sheet?.filter || null;
  const [filter, setFilter] = React.useState(filterInUse || "");
  const dispatch = useDispatch();
  const history = useHistory();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [mappingOpen, setMappingOpen] = React.useState(false);
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMappingOpen = () => {
    setMappingOpen(true);
  };

  const handleMappingClose = () => {
    setMappingOpen(false);
  };

  const dir = spreadsheetId && sheet ? join(spreadsheetId, sheet.title) : "./";

  const applyQuantityColumn = (e: React.ChangeEvent<any>) => {
    if (!sheet) return;
    if (!spreadsheetId) return;

    dispatch(
      actions.spreadsheets.setQuantityColumn({
        sheetColumn:
          e.target.value === "null" ? null : parseInt(e.target.value, 10),
        sheetTitle: sheet.title,
        spreadsheetTitle: spreadsheetId,
      })
    );
  };

  const applyDesign = (design: string) => () => {
    if (!sheet) return;
    if (!spreadsheetId) return;

    setOpen(false);

    dispatch(
      actions.spreadsheets.setDesign({
        component: design,
        sheetTitle: sheet.title,
        spreadsheetTitle: spreadsheetId,
      })
    );
  };

  const applyColumnMap = (i: number) => (e: React.ChangeEvent<any>) => {
    if (!sheet) return;
    if (!spreadsheetId) return;

    dispatch(
      actions.spreadsheets.setColumnMap({
        sheetTitle: sheet.title,
        spreadsheetTitle: spreadsheetId,
        expectedColumn: i,
        sheetColumn: parseInt(e.target.value, 10),
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
        spreadsheetTitle: spreadsheetId,
      })
    );
  };

  let component: null | DesignComponent = null;

  const componentName = sheet && sheet.designMap && sheet.designMap.component;

  if (componentName) {
    const parts = componentName.split(".");
    const design = get(designs, parts, null) as DesignComponent | undefined;

    if (design && typeof design.component === "function") {
      component = design;
    }
  }

  const components: string[] = [];

  const loop = (items: Designs, parent?: string) => {
    Object.keys(items).forEach((key) => {
      const nextParent = parent ? `${parent}.${key}` : key;
      const design = items[key];

      if (design.component && typeof design.component === "function") {
        components.push(nextParent);
      } else {
        // @ts-ignore
        loop(design, nextParent);
      }
    });
  };

  loop(designs);

  const filteredRows = sheet
    ? filterRows(sheet, filterInUse || "")
    : { rows: [] };

  const quantityRows = rowsWithQuantity(
    filteredRows.rows,
    sheet ? sheet.quantityColumn : undefined
  );

  const optionRows = rowsWithOption(
    quantityRows,
    sheet ? sheet.options : undefined
  );

  const isTable = match.params.sheetView === "table";

  const columnMapping =
    sheet && sheet.designMap && sheet.designMap.columnMapping;
  const headings = sheet && sheet.headings;

  console.log("sheet.options", sheet, sheet && sheet.options);

  const handleOptionChange = (option: string, checked: boolean) => () => {
    if (!sheet) return;
    if (!spreadsheetId) return;

    let options = sheet.options || [];

    if (checked) {
      if (options.includes(option)) {
        return;
      } else {
        options.push(option);
      }
    } else {
      options = options.filter((o) => o !== option);
    }

    dispatch(
      actions.spreadsheets.setOptions({
        options,
        spreadsheetTitle: spreadsheetId,
        sheetTitle: sheet.title,
      })
    );
  };

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
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: 600 }}
              />
              <IconButton onClick={applyFilter}>
                <SaveIcon />
              </IconButton>
            </Filter>
          </NoPrint>

          {isTable ? (
            <Table rows={filteredRows.rows} headings={sheet.headings} />
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

                {headings && (
                  <ComponentTitle>
                    <Typography variant="h6" component="h2">
                      Quantity Column:
                    </Typography>
                    <Select
                      value={sheet.quantityColumn || "null"}
                      onChange={applyQuantityColumn}
                      style={{ width: 200 }}
                    >
                      <MenuItem value="null">None</MenuItem>
                      {headings.map((heading, i) => (
                        <MenuItem key={i} value={i}>
                          {i} - {heading}
                        </MenuItem>
                      ))}
                    </Select>
                  </ComponentTitle>
                )}

                {component && component.options && (
                  <ComponentTitle>
                    <Typography variant="h6" component="h2">
                      Options:
                    </Typography>
                    {component.options.map((option) => {
                      const checked =
                        !!sheet &&
                        !!sheet.options &&
                        sheet.options.includes(option);

                      return (
                        <FormControlLabel
                          key={option}
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={handleOptionChange(option, !checked)}
                              name={option}
                            />
                          }
                          label={option}
                        />
                      );
                    })}
                  </ComponentTitle>
                )}

                {component && (
                  <Button
                    onClick={handleMappingOpen}
                    variant="contained"
                    style={{ marginRight: 20 }}
                  >
                    Set Mapping
                  </Button>
                )}
              </NoPrint>
              <Design
                dir={dir}
                rows={optionRows}
                headings={sheet.headings}
                columnMapping={sheet.designMap && sheet.designMap.columnMapping}
                component={component && component.component}
                expectedColumnorder={component && component.expectedColumnOrder}
              />
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
              >
                <div style={modalStyle} className={classes.paper}>
                  <ul>
                    {components.map((text) => (
                      <li key={text}>
                        <ComponentButton onClick={applyDesign(text)}>
                          <Typography>{text}</Typography>
                        </ComponentButton>
                      </li>
                    ))}
                  </ul>
                </div>
              </Modal>
              {component && columnMapping && headings && (
                <Modal
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={mappingOpen}
                  onClose={handleMappingClose}
                >
                  <div style={modalStyle} className={classes.paper}>
                    <ul>
                      {component.expectedColumnOrder.map((text, i) => (
                        <li key={text} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex" }}>
                            <Typography style={{ flex: 1 }} variant="caption">
                              {text}
                            </Typography>

                            <Select
                              value={
                                typeof columnMapping[i] === "number"
                                  ? columnMapping[i]
                                  : i
                              }
                              onChange={applyColumnMap(i)}
                              style={{ width: 200 }}
                            >
                              {headings.map((heading, j) => (
                                <MenuItem key={j} value={j}>
                                  {j} - {heading}
                                </MenuItem>
                              ))}
                            </Select>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Modal>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default Sheet;
