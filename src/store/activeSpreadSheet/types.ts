import { ExtendedSpreadsheet } from "../spreadsheets/types";
export interface ActiveSpreadSheet {
  title: string;
  activeSheet: string | null;
}

export type ActiveSpreadSheetState = ActiveSpreadSheet | null;

export type FullActiveSpreadSheet =
  | (ExtendedSpreadsheet & ActiveSpreadSheetState)
  | null;
