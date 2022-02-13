import React, {CSSProperties, PropsWithChildren, useMemo, useState} from "react";
import {createUseStyles} from "react-jss";
import {Rows} from "./Rows";
import {ColumnHeadings} from "./ColumnHeadings";
import {useColumnFilter} from "./hooks/useColumnFilter";
import {useColumnSorter} from "./hooks/useColumnSOrter";
import {GridToolbar} from "./GridToolbar";
import {useEventCallback} from "../../hooks/useEventCallback";
import {GridResultInfo} from "./GridResult";

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
  children?: never;
}

interface DataGridStyleProps {
  gridColumnsWidth: Array<string | number>;
}

export type VisibleColumns = {[key: string]: string};

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

export const DataGrid = <RowData,>(props: PropsWithChildren<DataGridProps<RowData>>) => {
  const {columns, rows, loading, fixedHeaderWhenScroll, getRowId} = props;

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

  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(columnNameToColumn);

  const gridColumnsWidth = useMemo(() => {
    return columns.map(c => {
      return visibleColumns[c.headerName] ? c.width : null
    }).filter(Boolean) as DataGridColumn<RowData>["width"][];
  }, [visibleColumns, columns]);

  const classes = useStyles({gridColumnsWidth});
  const {filteredRows, onFilterChange, totalFilters, clearFilters} = useColumnFilter({columns, rows, visibleColumns, columnNameToFieldId});
  const {sortedRows, activeColumnSorter, onSortChange} = useColumnSorter(columns, filteredRows);

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