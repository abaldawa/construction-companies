/**
 * @author Abhijit Baldawa
 */

import React, {memo} from "react";
import {DataGridProps, VisibleColumns} from "../index";
import {Row} from "../Row";

export interface RowsProps<RowData> extends Pick<DataGridProps<RowData>, "rows" | "columns" | "getRowId"> {
  visibleColumns: VisibleColumns;
}

const RowsComponent = <RowData,>(props: RowsProps<RowData>) => {
  const {rows, columns,visibleColumns, getRowId} = props;

  return (
    <>
      {rows.map(row => {
        return <Row
          key={getRowId(row)}
          row={row}
          columns={columns}
          visibleColumns={visibleColumns}
        />
      })}
    </>
  );
};

export const Rows = memo(RowsComponent) as typeof RowsComponent;