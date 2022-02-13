import React from "react";
import type {DataGridColumn, DataGridProps} from "../index";
import {createUseStyles} from "react-jss";
import type {ColumnSortOrder} from "../index";
import {ColumnSorter} from "../index";
import {FilterChangeFun} from "../hooks/useColumnFilter";
import {Input} from "../columnFilters/InputFilter";
import {ColumnSortArrow} from "../ColumnSortArrow";

interface ColumnHeadingProps<RowData> extends Pick<DataGridColumn<RowData>, "headerName" | "type" | "filter" | "fieldId">, Pick<DataGridProps<RowData>, "fixedHeaderWhenScroll"> {
  onFilterChange?: FilterChangeFun<RowData>;
  onSortChange: (fieldId: DataGridColumn<RowData>["fieldId"], columnSortOrder: ColumnSortOrder) => void;
  activeColumnSorter: Record<DataGridColumn<RowData>["fieldId"], { sort: ColumnSorter<RowData>["sort"]; sortOrder: NonNullable<ColumnSortOrder>}>;
  enableSorting?: boolean;
  children?: never;
}

const useStyles = createUseStyles({
  columnHeading: {
    textAlign: "center",
    padding: "0.5rem",
    borderBottom: "1px solid rgb(224, 224, 224)",
    background: "lightyellow",
  },
  columnHeadingText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  fixedHeader: {
    position: "sticky",
    top: "0px"
  }
});

export const ColumnHeading = <RowData,>(props: ColumnHeadingProps<RowData>) => {
  const {
    headerName,
    type,
    filter,
    fieldId,
    onFilterChange,
    onSortChange,
    activeColumnSorter,
    enableSorting,
    fixedHeaderWhenScroll
  } = props;
  const classes = useStyles();

  const getFilter = () => {
    if(filter) {
      if(typeof filter !== "boolean" && filter.renderColumnFilter) {
        return filter.renderColumnFilter((arg: any, clearFilter) => {
          onFilterChange?.(fieldId, arg, clearFilter);
        });
      } else {
        switch (type) {
          case "number":
            return <Input<number>
              type="number"
              onInputChange={({inputValue, clearInput}) => onFilterChange?.(fieldId, inputValue, clearInput)}
              style={{width: "100%"}}
            />;
          case "boolean":
            return <Input<boolean>
              type="checkbox"
              onInputChange={({inputValue, clearInput}) => onFilterChange?.(fieldId, inputValue, clearInput)}
              style={{width: "100%"}}
            />;
          case "string":
          default:
            return <Input<string>
              type="text"
              onInputChange={({inputValue, clearInput}) => onFilterChange?.(fieldId, inputValue, clearInput)}
              style={{width: "100%"}}
            />;
        }
      }
    }
  };

  const onSortClick = () => {
    if(onSortChange) {
      let columnSortOrder: ColumnSortOrder;

      if(activeColumnSorter[fieldId]?.sortOrder === "ASC") {
        columnSortOrder = "DES";
      } else if(activeColumnSorter[fieldId]?.sortOrder === "DES") {
        columnSortOrder = undefined;
      } else {
        columnSortOrder = "ASC";
      }

      onSortChange(fieldId, columnSortOrder);
    }
  };

  return (
    <div className={`${classes.columnHeading} ${fixedHeaderWhenScroll ? classes.fixedHeader : ""}`}>
      <div className={classes.columnHeadingText}>
        <b>{headerName}</b>
          {enableSorting && (
            <ColumnSortArrow
              sortOrder={activeColumnSorter[fieldId]?.sortOrder}
              onSortClick={onSortClick}
            />
          )}
      </div>
      {getFilter()}
    </div>
  );
};