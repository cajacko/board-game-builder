import React from "react";
import { createSelector } from "reselect";
import styled from "styled-components";
import { Value } from "../store/spreadsheets/types";
import { Props as DesignProps } from "../designs/types";

interface Props {
  headings: Value[];
  rows: Value[][];
  component: React.ComponentType<DesignProps> | null;
  pageSize?: number;
  page?: number;
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

function Table({
  headings,
  rows,
  component: Component,
  pageSize,
  page
}: Props) {
  if (!Component) return <p>No Component</p>;

  let mappedRows = mappedRowSelector(rows, headings);

  if (page && pageSize) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    mappedRows = mappedRows.slice(start, end);
  }

  return (
    <>
      {mappedRows.length === 0 && <div>No Items</div>}
      <Container className="print">
        {mappedRows.map((row, i) => (
          <React.Fragment key={i}>
            <Component {...row} />
          </React.Fragment>
        ))}
      </Container>
    </>
  );
}

export default Table;
