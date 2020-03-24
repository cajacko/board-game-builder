import designs from "../../designs";

export type Value = string | number | boolean | undefined;
export interface RawSpreadsheetData {
  sheets: Array<{
    properties: {
      title: string;
    };
    data: Array<{
      rowData?: Array<{
        values?: Array<{ formattedValue?: string }>;
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

interface DesignMap {
  component: string;
  columnMapping: number[];
}

export interface ExtendedSheet extends Sheet {
  filter?: string;
  designMap?: DesignMap;
  quantityColumn?: number;
}

export type SpreadsheetData = Sheet[];

export type ExtendedSpreadsheetData = ExtendedSheet[];

export interface Spreadsheet<S = SpreadsheetData> {
  id: string;
  title: string;
  dateCreated: number;
  dateLastOpened: number | null;
  data: null | S;
  lastFetchedData: number | null;
  filters: {
    [key: string]: string;
  };
  designMap: {
    [sheetTitle: string]: DesignMap;
  };
  quantityMap: {
    [sheetTitle: string]: number;
  };
}

export type ExtendedSpreadsheet = Spreadsheet<ExtendedSpreadsheetData>;

export interface SpreadsheetsState {
  [key: string]: Spreadsheet;
}
