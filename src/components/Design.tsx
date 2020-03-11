import React from "react";
import { createSelector } from "reselect";
import styled from "styled-components";
import { Value } from "../store/spreadsheets/types";
import { Props as DesignProps } from "../designs/types";
import mmToPx from "../utils/mmToPx";
import getIsPrintLayout from "../utils/getIsPrintLayout";
import { v4 as uuidv4 } from "uuid";
import { call } from "../utils/mainProcess";
import * as Types from "../types";

// In mm. This is the A4 size for my printer
const maxPrintSize = {
  width: 201,
  height: 288
};

interface Props {
  headings: Value[];
  rows: Value[][];
  component: React.ComponentType<DesignProps> | null;
}

const mappedRowSelector = createSelector<
  Value[][],
  Value[],
  Value[][],
  Value[],
  DesignProps[]
>(
  (rows: Value[][]): Value[][] => rows,
  (rows: Value[][], headings: Value[]): Value[] => headings,
  (rows: Value[][], headings: Value[]) => {
    return rows.map(row => {
      return {
        columns: row,
        headings: row.reduce((acc, value, i) => {
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

function Table({ headings, rows, component: Component }: Props) {
  const allMappedRows = mappedRowSelector(rows, headings);

  const [showCount, setShowCount] = React.useState<number>(
    allMappedRows.length
  );
  const [offset, setOffset] = React.useState<number>(0);
  const ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const onlyShowVisible = getIsPrintLayout();

  React.useEffect(() => {
    if (!onlyShowVisible) return;
    if (!ref.current) return;

    const visibleCount = getVisibleCount(ref.current.children);

    console.log({ visibleCount });

    if (onlyShowVisible) setShowCount(visibleCount);
  }, [setShowCount, onlyShowVisible, ref]);

  if (!Component) return <p>No Component</p>;

  const end =
    onlyShowVisible && showCount !== null ? offset + showCount : undefined;

  const visibleMappedRows = allMappedRows.slice(offset, end);

  function screenshot() {
    const windowId = uuidv4();

    const height = mmToPx(maxPrintSize.height);
    const width = mmToPx(maxPrintSize.width);

    call<Types.CREATE_WINDOW>("CREATE_WINDOW", {
      windowId,
      height,
      width,
      show: false,
      url: window.location.href
    })
      .then(() => {
        console.log("yay");
      })
      .then(() =>
        call<Types.SCREENSHOT>("SCREENSHOT", {
          windowId,
          height,
          width,
          x: 0,
          y: 0,
          filename: `${offset}-${end}`
        })
      )
      .catch(e => {
        console.log("oh no", e);
      });
    // .then(() => call<Types.DESTROY_WINDOW>("DESTROY_WINDOW", { windowId }));
  }

  return (
    <>
      <button onClick={screenshot}>Screenshot</button>
      {visibleMappedRows.length === 0 && <div>No Items</div>}
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

export default Table;
