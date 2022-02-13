import React, {memo} from "react";
import {ColumnSorter, ColumnSortOrder, DataGridColumn, DataGridProps, VisibleColumns} from "../index";
import {ColumnHeading} from "../ColumnHeading";
import {FilterChangeFun} from "../hooks/useColumnFilter";

interface ColumnHeadingsProps<RowData> extends Pick<DataGridProps<RowData>, "columns" | "fixedHeaderWhenScroll"> {
  onFilterChange?: FilterChangeFun<RowData>;
  onSortChange: (fieldId: DataGridColumn<RowData>["fieldId"], columnSortOrder: ColumnSortOrder) => void;
  activeColumnSorter: Record<DataGridColumn<RowData>["fieldId"], { sort: ColumnSorter<RowData>["sort"]; sortOrder: NonNullable<ColumnSortOrder>}>;
  visibleColumns: VisibleColumns;
  children?: never;
}

const ColumnHeadingsComponent = <RowData,>(props: ColumnHeadingsProps<RowData>) => {
  const {columns, onFilterChange, onSortChange, activeColumnSorter, fixedHeaderWhenScroll, visibleColumns} = props;

  return (
    <>
      {columns.map(column => {
        if(!visibleColumns[column.headerName]) {
          return null;
        }
        return <ColumnHeading
          key={column.fieldId as string}
          fixedHeaderWhenScroll={fixedHeaderWhenScroll}
          enableSorting={!!column.sort}
          activeColumnSorter={activeColumnSorter}
          onSortChange={onSortChange}
          fieldId={column.fieldId}
          headerName={column.headerName}
          type={column.type}
          filter={column.filter}
          onFilterChange={onFilterChange}
        />
      })}
    </>
  );
};

export const ColumnHeadings = memo(ColumnHeadingsComponent) as typeof ColumnHeadingsComponent;