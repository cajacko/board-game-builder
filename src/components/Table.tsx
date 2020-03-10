import React from "react";
import { Value } from "../store/spreadsheets/types";
import TableUI from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

interface Props {
  headings: Value[];
  rows: Value[][];
}

function Table({ headings, rows }: Props) {
  return (
    <TableContainer>
      <TableUI>
        <TableHead>
          <TableRow>
            {headings.map((value, i) => (
              <TableCell key={i}>{value}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((value, j) => (
                <TableCell key={j}>
                  {value !== (null || undefined) && `${value}`}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableUI>
    </TableContainer>
  );
}

export default Table;
