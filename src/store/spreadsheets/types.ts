type Value = string | number | boolean | undefined;
export interface RawSpreadsheetData {
  sheets: Array<{
    properties: {
      title: string;
    };
    data: Array<{
      rowData: Array<{
        values: Array<{ formattedValue?: string }>;
      }>;
    }>;
  }>;
}

export interface Sheet {
  title: string;
  headings: Value[];
  rows: Value[][];
  columnCount: number;
  rowCount: number;
}

export type SpreadsheetData = Sheet[];

export interface Spreadsheet {
  id: string;
  title: string;
  dateCreated: number;
  dateLastOpened: number | null;
  data: null | SpreadsheetData;
  lastFetchedData: number | null;
}

export interface SpreadsheetsState {
  [key: string]: Spreadsheet;
}
