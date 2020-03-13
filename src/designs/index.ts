import React from "react";
import { Props } from "./types";
import EscapeTheMadHouse from "./EscapeTheMadHouse";

export type DesignComponent = React.ComponentType<Props>;

export type Design = DesignComponent | Designs;

export interface Designs {
  [key: string]: Design;
}

const designs: Designs = {
  EscapeTheMadHouse
};

export default designs;
