/**
 * @author Abhijit Baldawa
 */

import React, {ReactNode, useEffect, useState} from "react";
import {createUseStyles} from 'react-jss';
import type {DataGridColumn} from "../index";
import {RowProps} from "../Row";

interface CellProps<RowData> extends
  Pick<DataGridColumn<RowData>, "cell" | "fieldId"> ,
  Pick<RowProps<RowData>, "row"> {}

const useStyles = createUseStyles({
  cell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem",
    borderBottom: "1px solid rgb(224, 224, 224)"
  }
});

/**
 * A flexible/configurable cell with below functionality:
 * 1. User can provide a custom 'renderCell' function and the
 *    grid will display the cell exactly as the user wants else
 *    the cell will show the value on a default style.
 * 2. The user can provide 'valueGetter' function to cell which
 *    basically formats the value to show on the cell.
 *    ex. Formatting a date string to a readable format instead
 *        of showing the ISO string values o cell.
 * 3. If 'editable' is set to true then the cell can also be edited
 * 4. If 'getStyle' method is provided then user can set the style
 *    of the cell in a specific custom format.
 *
 * @param props
 *
 * @constructor
 */
export const Cell = <RowData,>(props: CellProps<RowData>) => {
  const {
    row,
    fieldId,
    cell
  } = props;
  const classes = useStyles();
  const [showEditableCell, setShowEditableCell] = useState(false);
  const [editableText, setEditableText] = useState<string>("");

  let cellValue: ReactNode;

  if(cell?.renderCell) {
    // User has provided a custom method to render a cell so use that
    cellValue = cell.renderCell(row);
  } else {
    /**
     * If the user has provided a getter method to format what the
     * grid should display on the cell then use that else directly
     * show the original field from the row object
     */
    cellValue = cell?.valueGetter?.(row) ?? row[fieldId];

    if(cell?.editable && showEditableCell) {
      cellValue = <input
        ref={r=> r?.focus()}
        value={editableText}
        onBlur={() => {
          cell.onEdited?.(row, fieldId, editableText);
          setShowEditableCell(false);
        }}
        style={{width: "100%"}}
        onChange={e => setEditableText(e.target.value)}
      />;
    }
  }

  useEffect(() => {
    if(cell?.editable && showEditableCell) {
      setEditableText(row[fieldId] as any as string);
    } else {
      setEditableText("");
    }
  }, [cell?.editable, showEditableCell]);

  return (
    <div
      className={classes.cell}
      style={cell?.getStyle?.(row)}
      onDoubleClick={() => setShowEditableCell(true)}
    >
      {cellValue}
    </div>
  );
};