import * as Types from "../types";

function getSendWindowAction<A extends Types.AllActions = Types.AllActions>(
  type: A["type"],
  payload: A["payload"]
) {
  return {
    type,
    payload
  };
}

export default getSendWindowAction;
