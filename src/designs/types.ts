import { Value } from "../store/spreadsheets/types";

export interface Props {
  columns: Value[];
  headings: {
    [key: string]: Value;
  };
}
