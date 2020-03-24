import React from "react";
import { Value } from "../store/spreadsheets/types";

export interface RowWithOption {
  option: string | null;
  row: Value[];
}

export interface Props {
  columns: Value[];
  headings: {
    [key: string]: Value;
  };
  option: string | null;
}

export interface DesignComponent {
  component: React.ComponentType<Props>;
  expectedColumnOrder: string[];
  options?: string[];
}

export type Design = DesignComponent | Designs;

export interface Designs {
  [key: string]: Design;
}
