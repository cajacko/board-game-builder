import { createAction } from "typesafe-actions";
import { SpreadsheetData, RawSpreadsheetData } from "./types";

export const addSpreadsheet = createAction(
  "ADD_SPREADSHEET",
  ({ id, title }: { id: string; title: string }) => ({
    id,
    time: new Date().getTime(),
    title
  })
)<{
  id: string;
  time: number;
  title: string;
}>();

export const removeSpreadsheet = createAction("REMOVE_SPREADSHEET")<{
  title: string;
}>();

export const setSpreadsheetData = createAction(
  "SET_SPREADSHEET_DATA",
  ({ data, title }: { data: RawSpreadsheetData; title: string }) => {
    function cleanData(raw: RawSpreadsheetData): SpreadsheetData {
      const filteredData = raw.sheets.map(sheet => {
        let maxColumns = 0;

        const { rowData } = sheet.data[0];

        if (!rowData)
          return {
            title: sheet.properties.title,
            headings: [],
            rows: [],
            rowCount: 0,
            columnCount: 0
          };

        const rows = rowData
          .filter(row => {
            if (!row.values) return true;

            const isEmptyRow = row.values.every(value => {
              if (!value.formattedValue) return true;
              if (value.formattedValue === "") return true;
              if (value.formattedValue === "FALSE") return true;
              if (value.formattedValue === "0") return true;

              return false;
            });

            return !isEmptyRow;
          })
          .map(row => {
            if (!row.values) return [];

            if (row.values.length > maxColumns) maxColumns = row.values.length;

            return row.values.map((value, i) => {
              let formattedValue;

              if (!value.formattedValue) {
                formattedValue = undefined;
              } else if (value.formattedValue === "") {
                formattedValue = undefined;
              } else if (value.formattedValue === "FALSE") {
                formattedValue = false;
              } else if (value.formattedValue === "TRUE") {
                formattedValue = true;
                // @ts-ignore
              } else if (!isNaN(value.formattedValue)) {
                formattedValue = parseInt(value.formattedValue, 10);
              } else {
                formattedValue = value.formattedValue;
              }

              return formattedValue;
            });
          });

        const headings = rows.splice(0, 1)[0];

        for (var i = 0; i < maxColumns; i++) {
          if (!headings[i]) headings[i] = `Column ${i}`;
        }

        return {
          title: sheet.properties.title,
          headings,
          rows,
          rowCount: rows.length,
          columnCount: maxColumns
        };
      });

      return filteredData;
    }

    return {
      time: new Date().getTime(),
      data: cleanData(data),
      title
    };
  }
)<{
  data: SpreadsheetData;
  time: number;
  title: string;
}>();

export const setFilter = createAction("SET_FILTER")<{
  filter: string;
  spreadsheetTitle: string;
  sheetTitle: string;
}>();

export const setDesign = createAction("SET_DESIGN")<{
  component: string;
  spreadsheetTitle: string;
  sheetTitle: string;
}>();

export const setColumnMap = createAction("SET_COLUMN_MAP")<{
  sheetColumn: number;
  expectedColumn: number;
  spreadsheetTitle: string;
  sheetTitle: string;
}>();
