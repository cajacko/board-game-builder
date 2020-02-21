import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { sheetsSelector } from "../store/activeSpreadSheet/selectors";
import actions from "../store/actions";
import useFetchSpreadSheet from "../hooks/useFetchSpreadSheet";

function SpreadSheet() {
  const sheets = useSelector(sheetsSelector);
  const dispatch = useDispatch();
  const status = useFetchSpreadSheet();

  return (
    <div>
      SpreadSheet {status}
      <ul>
        {sheets &&
          sheets.map(title => (
            <li key={title}>
              <button
                onClick={() => {
                  dispatch(actions.activeSpreadSheet.setActiveSheet({ title }));
                  dispatch(actions.route.setRoute({ route: "SHEET" }));
                }}
              >
                {title}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default SpreadSheet;
