import React from "react";
import {Cell} from "../Cell";
import type {DataGridProps, VisibleColumns} from "../index";

interface RowProps<RowData> extends Pick<DataGridProps<RowData>, "columns">{
  row: RowData;
  visibleColumns: VisibleColumns;
}

export const Row = <RowData,>(props: RowProps<RowData>) => {
  const { row, columns, visibleColumns } = props;

  return (
    <>
      {columns.map( column => {
        if(!visibleColumns[column.headerName]) {
          return null;
        }
        return <Cell
          key={column.fieldId as string}
          cell={column.cell}
          row={row}
          fieldId={column.fieldId}
          width={column.width}
        />;
      } )}
    </>
  );
};