import React from "react";
import { useSelector } from "react-redux";
import { sheetSelector } from "../store/activeSpreadSheet/selectors";
import useFetchSpreadSheet from "../hooks/useFetchSpreadSheet";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

function Sheet() {
  const sheet = useSelector(sheetSelector);
  const status = useFetchSpreadSheet();

  return (
    <div>
      SpreadSheet {status}
      {sheet && (
        <>
          {sheet.title}
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
                {sheet.rows.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((value, j) => (
                      <TableCell key={j}>{value}</TableCell>
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
