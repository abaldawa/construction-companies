/**
 * @author Abhijit Baldawa
 */

import React, {CSSProperties, useMemo, useState} from "react";
import {createUseStyles} from "react-jss";
import {Rows} from "./Rows";
import {ColumnHeadings} from "./ColumnHeadings";
import {useColumnFilter} from "./hooks/useColumnFilter";
import {useColumnSorter} from "./hooks/useColumnSOrter";
import {GridToolbar} from "./GridToolbar";
import {useEventCallback} from "../../hooks/useEventCallback";
import {GridResultInfo} from "./GridResult";

export type VisibleColumns = {[key: string]: string};

export interface ColumFilter<RowData> {
  renderColumnFilter?: (onColumnFilter: (arg: any, clearFilter: () => void) => void) => JSX.Element;
  filterData: (row: RowData, searchTerm: any) => boolean;
}

export type ColumnSortOrder = "ASC" | "DES" | undefined;
export interface ColumnSorter<RowData> {
  sort: (row1: RowData, row2: RowData, sortOrder: ColumnSortOrder) => number;
}

export interface DataGridColumn<RowData> {
  fieldId: keyof RowData;
  headerName: string;
  width: string | number;
  type?: "number" | "string" | "boolean";
  cell?: {
    renderCell?: (row: RowData) => JSX.Element;
    valueGetter?: (row: RowData) => React.ReactNode;
    editable?: boolean;
    onEdited?: (row: RowData, fieldId: keyof RowData, updatedValue: any) => void;
    getStyle?: (row: RowData) => CSSProperties | undefined;
  };
  filter?: ColumFilter<RowData> | boolean;
  sort?: ColumnSorter<RowData> | boolean;
}

export interface DataGridProps<RowData> {
  columns: DataGridColumn<RowData>[];
  rows: RowData[];
  getRowId: (row: RowData) => string | number;
  loading?: boolean;
  fixedHeaderWhenScroll?: boolean;
}

interface DataGridStyleProps {
  gridColumnsWidth: Array<string | number>;
}

const useStyles = createUseStyles({
  root: {
    display: "inline-block",
    position: "relative"
  },
  dataGrid: {
    display: "grid",
    minHeight: "420px",
    maxHeight: "420px",
    minWidth: "900px",
    gridTemplateColumns: (props: DataGridStyleProps) => props.gridColumnsWidth.join(" "),
    gridAutoRows: "max-content",
    border: "1px solid rgb(224, 224, 224)",
    borderRadius: "10px",
    overflow: "scroll",
    position: "relative",
    maxWidth: "900px"
  },
  loading: {
    pointerEvents: "none",
    letterSpacing: "0.8rem",
    position: "absolute",
    width: "100%",
    textAlign: "center",
    top: "50%",
    color: "rgba(130, 130, 130, 0.80)",
    fontSize: "1.2rem"
  }
});

export const DataGrid = <RowData,>(props: DataGridProps<RowData>) => {
  const {columns, rows, loading, fixedHeaderWhenScroll, getRowId} = props;

  /**
   * 1. Setup all the data structure to find the columnName and columnId in the
   *    most efficient way
   */
  const {columnNames, columnNameToColumn, columnNameToFieldId} = useMemo(() => {
    const columnNames: string[] = [];
    const columnNameToColumn: VisibleColumns = {};
    const columnNameToFieldId: VisibleColumns = {};

    for(const column of columns) {
      columnNames.push(column.headerName);
      columnNameToColumn[column.headerName] = column.headerName;
      columnNameToFieldId[column.headerName] = column.fieldId as string;
    }

    return {columnNames, columnNameToColumn, columnNameToFieldId};
  }, [columns]);

  /**
   * 2. In the first render all columns are visible, and so we feed columnNameToColumn
   *    to visibleColumns state
   */
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(columnNameToColumn);

  /**
   * 3. We need the column width of visible columns and react when visibleColumns changes
   */
  const gridColumnsWidth = useMemo(() => {
    return columns.map(c => {
      return visibleColumns[c.headerName] ? c.width : null
    }).filter(Boolean) as DataGridColumn<RowData>["width"][];
  }, [visibleColumns, columns]);

  /**
   * 4. Update the CSS grid about the number of visible grid columns and their width
   */
  const classes = useStyles({gridColumnsWidth});

  /**
   * 5. With the knowledge of 'columns', 'rows' and 'visibleColumns' the filter custom hook
   *    will give filtered rows which matched filtering criteria of ALL filters on the UI
   */
  const {filteredRows, onFilterChange, totalFilters, clearFilters} = useColumnFilter({columns, rows, visibleColumns, columnNameToFieldId});

  /**
   * 6. Feed the 'filteredRows' to sorter custom hook so that it will sort all the rows
   *    based on any active colum sorter.
   */
  const {sortedRows, activeColumnSorter, onSortChange} = useColumnSorter(columns, filteredRows);

  /**
   * If the user tries to show/hide any column then this handler handles the event and updates
   * the visible columns in the state and all the hooks will react accordingly to update data grid
   *
   * @param selectedColumns - Array of only visible columns based on user selection
   */
  const onColumnShowOrHideHandler = useEventCallback((selectedColumns?: string[]) => {
    setVisibleColumns(selectedColumns ?
      selectedColumns.reduce((result, columnHeading) => {
        result[columnHeading] = columnHeading;
        return result;
      }, {} as VisibleColumns) :
      {}
    );
  });

  return (
    <div className={classes.root}>
      <GridToolbar
        columns={columnNames}
        totalActiveFilters={totalFilters}
        clearActiveFilters={clearFilters}
        selectedColumns={visibleColumns}
        onColumnShowOrHideHandler={onColumnShowOrHideHandler}
      />
      <div className={classes.dataGrid}>
        <ColumnHeadings
          columns={columns}
          visibleColumns={visibleColumns}
          fixedHeaderWhenScroll={fixedHeaderWhenScroll}
          activeColumnSorter={activeColumnSorter}
          onSortChange={onSortChange}
          onFilterChange={onFilterChange}
        />
        <Rows
          rows={sortedRows}
          visibleColumns={visibleColumns}
          getRowId={getRowId}
          columns={columns}
        />
      </div>
      <GridResultInfo currentlyShowing={sortedRows.length} totalRows={rows.length}/>
      {loading && <div className={classes.loading}>Loading...</div>}
    </div>
  );
};