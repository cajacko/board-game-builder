import queryString from "query-string";

let windowId = queryString.parse(window.location.search)["window-id"];

if (typeof windowId !== "string") windowId = null;

export default windowId as string | null;
