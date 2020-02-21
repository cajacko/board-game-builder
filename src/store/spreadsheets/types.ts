export interface Spreadsheet {
  id: string;
  title: string;
  dateCreated: number;
  dateLastOpened: number | null;
}

export interface SpreadsheetsState {
  [key: string]: Spreadsheet;
}
