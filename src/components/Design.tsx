import React from "react";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { Value } from "../store/spreadsheets/types";
import {
  Props as DesignProps,
  DesignComponent,
  RowWithOption
} from "../designs/types";
import mmToPx from "../utils/mmToPx";
import { v4 as uuidv4 } from "uuid";
import { call } from "../utils/mainProcess";
import * as Types from "../types";
import dispatchActionToWindow from "../utils/dispatchActionToWindow";
import actions from "../store/actions";
import NoPrint from "../components/NoPrint";
import windowId from "../config/windowId";

// In mm. This is the A4 size for my printer
const maxPrintSize = {
  width: 201,
  height: 288
};

interface Props {
  headings: Value[];
  rows: RowWithOption[];
  component: DesignComponent["component"] | null;
  columnMapping?: number[];
  expectedColumnorder: string[] | null;
  dir: string;
}

const mappedRowSelector = createSelector<
  RowWithOption[],
  Value[],
  RowWithOption[],
  Value[],
  DesignProps[]
>(
  (rows: RowWithOption[]): RowWithOption[] => rows,
  (rows: RowWithOption[], headings: Value[]): Value[] => headings,
  (rows: RowWithOption[], headings: Value[]) => {
    return rows.map(row => {
      return {
        option: row.option,
        columns: row.row,
        headings: row.row.reduce((acc, value, i) => {
          const key = headings[i] ? `${headings[i]}` : `column${i + 1}`;

          return {
            ...acc,
            [key]: value
          };
        }, {})
      };
    });
  }
);

const Container = styled.div`
  font-family: helvetica, sans-serif;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
  overflow: hidden;

  * {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 5mm;
    font-weight: normal;
  }
`;

function getVisibleCount(children: HTMLCollection) {
  const windowBottom = window.outerHeight;

  for (var i = 0; i < children.length; i++) {
    const child = children[i];

    if (child.getBoundingClientRect().bottom > windowBottom) {
      return i;
    }
  }

  return children.length;
}

let startedSaving = false;

function Design({
  dir,
  headings,
  rows,
  component: Component,
  columnMapping,
  expectedColumnorder
}: Props) {
  const allMappedRows = mappedRowSelector(rows, headings);
  const printSettings = useSelector(({ printSettings }) => printSettings);
  const isPrintWindow = useSelector(({ isPrintWindow }) => isPrintWindow);
  const [start, setStart] = React.useState(0);
  const [visibleCount, setVisibleCount] = React.useState<number>(
    allMappedRows.length
  );

  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const onlyShowVisible = isPrintWindow;

  React.useEffect(() => {
    if (!onlyShowVisible) return;
    if (!ref.current) return;

    if (onlyShowVisible) setVisibleCount(getVisibleCount(ref.current.children));
  }, [setVisibleCount, onlyShowVisible, ref]);

  React.useEffect(() => {
    if (!printSettings) return;
    if (startedSaving) return;

    startedSaving = true;

    console.log("START THIS TRAIN");

    let s = 0;

    function loop(): Promise<void> {
      let e = s + visibleCount;

      if (s > allMappedRows.length) return Promise.resolve();

      return new Promise(resolve => setTimeout(resolve, 500))
        .then(() => {
          if (!windowId) return Promise.resolve();
          if (!printSettings) return Promise.resolve();

          call<Types.SCREENSHOT>("SCREENSHOT", {
            windowId,
            height: printSettings.height,
            width: printSettings.width,
            x: 0,
            y: 0,
            filename: `${s + 1}-${e}`,
            directory: dir
          });
        })
        .then(() => {
          s = e;
          setStart(e);

          return new Promise(resolve => setTimeout(resolve, 500));
        })
        .then(loop);
    }

    loop()
      .then(() => call<Types.OPEN_DIR>("OPEN_DIR", { directory: dir }))
      .then(() => {
        if (!windowId) return Promise.resolve();

        return call<Types.DESTROY_WINDOW>("DESTROY_WINDOW", { windowId });
      });
  }, [printSettings, setStart, visibleCount, allMappedRows.length, dir]);

  if (!Component) return <p>No Component</p>;

  let visibleMappedRows = allMappedRows;

  if (printSettings && visibleCount) {
    visibleMappedRows = allMappedRows.slice(start, start + visibleCount);
  }

  function screenshot() {
    const windowId = uuidv4();

    const height = mmToPx(maxPrintSize.height);
    const width = mmToPx(maxPrintSize.width);

    call<Types.CREATE_WINDOW>("CREATE_WINDOW", {
      windowId,
      height,
      width,
      show: false,
      // show: true,
      url: window.location.href
    })
      .then(() =>
        dispatchActionToWindow(
          windowId,
          actions.isPrintWindow.setIsPrintWindow({
            isPrintWindow: true
          })
        )
      )
      .then(() =>
        dispatchActionToWindow(
          windowId,
          actions.printSettings.setPrintSettings({
            height,
            width
          })
        )
      );
  }

  // TODO: selector for this
  visibleMappedRows = visibleMappedRows.map(row => {
    if (!expectedColumnorder) return row;
    if (!columnMapping) return row;

    let columns: Value[] = [];

    columns = expectedColumnorder.map((title, i) => {
      const map = columnMapping[i];

      if (typeof map !== "number") return row.columns[i];

      return row.columns[map];
    });

    return {
      ...row,
      columns
    };
  });

  return (
    <>
      <NoPrint>
        <Button
          onClick={screenshot}
          variant="contained"
          style={{ marginBottom: 20, marginTop: 20 }}
        >
          Save as Images
        </Button>
        {visibleMappedRows.length === 0 && <div>No Items</div>}
      </NoPrint>
      <Container className="print" ref={ref}>
        {visibleMappedRows.map((row, i) => (
          <React.Fragment key={i}>
            <Component {...row} />
          </React.Fragment>
        ))}
      </Container>
    </>
  );
}

export default Design;
