import queryString from "query-string";

function getIsPrintLayout() {
  const { print } = queryString.parse(window.location.search);

  // @ts-ignore
  return !!print && print.toLowerCase() === "true";
}

export default getIsPrintLayout;
