/**
 * @author Abhijit Baldawa
 */

import React from "react";
import {Cell} from "../Cell";
import type {DataGridProps} from "../index";
import {RowsProps} from "../Rows";

export interface RowProps<RowData> extends
  Pick<DataGridProps<RowData>, "columns">,
  Pick<RowsProps<RowData>, "visibleColumns">
{
  row: RowData;
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
        />;
      } )}
    </>
  );
};