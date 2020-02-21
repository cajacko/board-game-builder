import { createAction } from "typesafe-actions";

export const setApiKey = createAction("SET_GOOGLE_API_KEY")<{
  apiKey: string;
}>();
