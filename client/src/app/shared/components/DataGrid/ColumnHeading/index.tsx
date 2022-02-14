/**
 * @author Abhijit Baldawa
 */

import React from "react";
import type {DataGridColumn, DataGridProps} from "../index";
import {createUseStyles} from "react-jss";
import type {ColumnSortOrder} from "../index";
import {Input} from "../columnFilters/InputFilter";
import {ColumnSortArrow} from "../ColumnSortArrow";
import {ColumnHeadingsProps} from "../ColumnHeadings";

interface ColumnHeadingProps<RowData> extends
  Pick<DataGridColumn<RowData>, "headerName" | "type" | "filter" | "fieldId">,
  Pick<DataGridProps<RowData>, "fixedHeaderWhenScroll">,
  Pick<ColumnHeadingsProps<RowData>, "onFilterChange" | "onSortChange" | "activeColumnSorter">
{
  enableSorting?: boolean;
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
    type: columnType,
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
        /**
         *  If the user has provided a custom component to show as a filter on this
         *  column then show that instead and notify any filter changes.
         */
        return filter.renderColumnFilter((arg: any, clearFilter) => {
          onFilterChange?.(fieldId, arg, clearFilter);
        });
      } else {
        /**
         * If the user has NOT provided any filter component to render then render an
         * appropriate filter component based on the columnType
         */
        switch (columnType) {
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