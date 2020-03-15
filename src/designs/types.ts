import React from "react";
import { Value } from "../store/spreadsheets/types";

export interface Props {
  columns: Value[];
  headings: {
    [key: string]: Value;
  };
}

export interface DesignComponent {
  component: React.ComponentType<Props>;
  expectedColumnOrder: string[];
}

export type Design = DesignComponent | Designs;

export interface Designs {
  [key: string]: Design;
}
