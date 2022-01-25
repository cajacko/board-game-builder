import { Designs } from "../../types";
import prependDesignNames from "../../prependDesignNames";
import Crime from "./Crime";
import CrimeBlank from "./CrimeBlank";
import Action from "./Action";
import ActionBlank from "./ActionBlank";
import Vigilante from "./Vigilante";
import Gadget from "./Gadget";
import Location from "./Location";

const designs: Designs = {
  Crime,
  Action,
  Vigilante,
  Gadget,
  Location,
  CrimeBlank,
  ActionBlank,
};

export default prependDesignNames("Pre 0.13.0-", designs);
