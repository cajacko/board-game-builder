import { StateType, ActionType } from "typesafe-actions";
import { Dispatch } from "redux";

declare module "ReduxTypes" {
  export type Store = StateType<typeof import("./index").default>;
  export type RootAction = ActionType<typeof import("./actions").default>;
  export type RootState = StateType<typeof import("./reducers").default>;
}

declare module "typesafe-actions" {
  interface Types {
    RootAction: ActionType<typeof import("./actions").default>;
  }
}

declare module "react-redux" {
  function useSelector<
    TState = StateType<typeof import("./reducers").default>,
    TSelected = unknown
  >(
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
  ): TSelected;

  function useDispatch<
    TDispatch = Dispatch<ActionType<typeof import("./actions").default>>
  >(): TDispatch;
}

declare module "reselect" {
  type S = StateType<typeof import("./reducers").default>;

  export function createSelector<R1, T>(
    selector: Selector<S, R1>,
    combiner: (res: R1) => T
  ): OutputSelector<S, T, (res: R1) => T>;

  export function createSelector<R1, R2, T>(
    selector1: Selector<S, R1>,
    selector2: Selector<S, R2>,
    combiner: (res1: R1, res2: R2) => T
  ): OutputSelector<S, T, (res1: R1, res2: R2) => T>;
}
