import React, {PropsWithChildren, ReactNode, useEffect, useState} from "react";
import {createUseStyles} from 'react-jss';
import type {DataGridColumn} from "../index";

interface CellProps<RowData> extends Pick<DataGridColumn<RowData>, "cell" | "width" | "fieldId"> {
  row: RowData;
  children?: never;
}

const useStyles = createUseStyles({
  cell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem",
    borderBottom: "1px solid rgb(224, 224, 224)"
  }
});

export const Cell = <RowData,>(props: PropsWithChildren<CellProps<RowData>>) => {
  const {
    row,
    fieldId,
    width,
    cell
  } = props;
  const classes = useStyles();
  const [showEditableCell, setShowEditableCell] = useState(false);
  const [editableText, setEditableText] = useState<string>("");

  let cellValue: ReactNode;

  if(cell?.renderCell) {
    cellValue = cell.renderCell(row);
  } else {
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